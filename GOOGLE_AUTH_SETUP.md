# Google OAuth Setup Guide

## 1. Skaffa Google OAuth Credentials

1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Skapa ett nytt projekt eller välj ett befintligt
3. Navigera till **APIs & Services** → **Credentials**
4. Klicka på **Create Credentials** → **OAuth client ID**
5. Välj **Web application**
6. Konfigurera:
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (för lokal utveckling)
     - `https://wajkiedevelopment.se` (för produktion)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google`
     - `https://wajkiedevelopment.se/api/auth/callback/google`
7. Kopiera **Client ID** och **Client secret**

## 2. Konfigurera Environment Variables

### Lokalt (.env.local)
```bash
# Generera AUTH_SECRET
openssl rand -base64 32

# Lägg till i .env.local:
AUTH_SECRET=din_genererade_secret_här
GOOGLE_CLIENT_ID=din_google_client_id
GOOGLE_CLIENT_SECRET=din_google_client_secret
```

### Vercel
Gå till Vercel Dashboard → ditt projekt → Settings → Environment Variables och lägg till:
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 3. Testa Lokalt

```bash
npm run dev
```

Besök `http://localhost:3000/admin` - du kommer att omdirigeras till Google login.

## 4. Deploy till Vercel

```bash
git add .
git commit -m "Add Google OAuth authentication"
git push
```

Vercel kommer automatiskt att bygga om med de nya environment variables.

## 5. Säkerhet

⚠️ **VIKTIGT:** Efter deployment, verifiera att:
- Endast din Google-account kan logga in (NextAuth begränsar till autentiserade användare)
- Om du vill begränsa till specifika email-adresser, uppdatera `src/lib/auth.ts`:

```typescript
callbacks: {
  authorized: async ({ auth }) => {
    const allowedEmails = ['din@email.com'];
    return !!auth && allowedEmails.includes(auth.user?.email || '');
  },
},
```

## Hur det Fungerar

1. Användare besöker `/admin`
2. Om ej inloggad → redirect till `/auth/signin`
3. Klickar "Logga in med Google"
4. Google OAuth flow
5. Efter lyckad inloggning → redirect till `/admin`
6. Session sparas, "Logga ut"-knapp visas

## Felsökning

### "Invalid redirect_uri"
- Kontrollera att redirect URI:n i Google Console matchar exakt
- Glöm inte `/api/auth/callback/google` på slutet

### "Client authentication failed"
- Verifiera att `GOOGLE_CLIENT_ID` och `GOOGLE_CLIENT_SECRET` är korrekta
- Kontrollera att environment variables är laddade (starta om dev server)

### Session fungerar inte
- Kontrollera att `AUTH_SECRET` är satt
- Verifiera att `SessionProvider` finns i layout.tsx

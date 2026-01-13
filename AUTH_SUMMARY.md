# Google OAuth Integration - Snabbreferens

## ✅ Vad som är implementerat

- ✅ NextAuth.js v5 (Auth.js) installerad
- ✅ Google OAuth provider konfigurerad
- ✅ `/admin` skyddad route - kräver inloggning
- ✅ Login-sida med Google-knapp (`/auth/signin`)
- ✅ Logout-funktionalitet i admin-panelen
- ✅ Session management med SessionProvider

## 📁 Nya filer

```
src/
├── lib/
│   └── auth.ts                          # NextAuth konfiguration
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                     # Auth API route handler
│   ├── auth/signin/
│   │   └── page.tsx                     # Login-sida med Google
│   └── admin/
│       ├── page.tsx                     # Protected server component
│       └── AdminClient.tsx              # Client component med form
```

## 🔑 Environment Variables (behöver sättas)

### Lokalt: `.env.local`
```bash
AUTH_SECRET=             # Generera: openssl rand -base64 32
GOOGLE_CLIENT_ID=        # Från Google Cloud Console
GOOGLE_CLIENT_SECRET=    # Från Google Cloud Console
```

### Vercel: Environment Variables
Lägg till samma variabler i Vercel Dashboard under Settings → Environment Variables

## 🚀 Setup-steg

1. **Skaffa Google OAuth credentials** → Se `GOOGLE_AUTH_SETUP.md`
2. **Skapa `.env.local`** och lägg till AUTH_SECRET + Google credentials
3. **Kör lokalt:** `npm run dev`
4. **Testa:** Gå till `http://localhost:3000/admin`
5. **Deploy:** Push till GitHub, Vercel bygger automatiskt
6. **Konfigurera Vercel:** Lägg till environment variables

## 🔐 Hur det fungerar

```
Användare → /admin
    ↓
Ingen session?
    ↓
Redirect → /auth/signin
    ↓
Google OAuth Flow
    ↓
Callback → /api/auth/callback/google
    ↓
Session skapad
    ↓
Redirect → /admin ✅
```

## 🎨 UI Features

- Google-knapp med ikon
- Dark theme (matchar befintlig design)
- "Logga ut"-knapp i admin header
- Visar inloggad email

## 🔒 Säkerhet

Nuvarande setup: **Alla med Google-account kan logga in**

För att begränsa till specifika emails, uppdatera `src/lib/auth.ts`:

```typescript
callbacks: {
  authorized: async ({ auth }) => {
    const allowedEmails = ['din@email.com'];
    return !!auth && allowedEmails.includes(auth.user?.email || '');
  },
},
```

## 📝 Nästa steg (valfritt)

- [ ] Begränsa till specifika email-adresser
- [ ] Lägg till user roles (admin, editor, viewer)
- [ ] Database table för users
- [ ] Session persistence settings
- [ ] Remember me functionality

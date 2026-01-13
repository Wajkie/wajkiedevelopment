# 🔐 TOTP Authentication Setup (Google Authenticator)

## ✅ Vad som är implementerat

- ✅ TOTP (Time-based One-Time Password) med Google Authenticator
- ✅ Inga externa API:er (Google, Azure, etc.)
- ✅ Fungerar offline
- ✅ 6-siffriga tidsbegränsade koder
- ✅ 24h sessions med iron-session
- ✅ Setup-sida för QR-kod generering

## 🚀 Setup-steg

### 1. Generera Secrets

```bash
# SESSION_SECRET
openssl rand -base64 32

# Lägg till i .env.local:
SESSION_SECRET=din_genererade_secret_här
```

### 2. Besök Setup-sidan

```bash
npm run dev
```

Öppna: `http://localhost:3000/auth/setup`

### 3. Scanna QR-koden

**Alternativ 1: Google Authenticator**
- Öppna Google Authenticator-appen
- Tryck på "+"
- Välj "Scan QR code"
- Scanna koden på skärmen

**Alternativ 2: 1Password**
- Öppna 1Password
- Skapa ny inloggning
- Klicka på "Add One-Time Password"
- Scanna QR-kod ELLER klistra in secret manuellt

### 4. Spara TOTP_SECRET

Kopiera `TOTP_SECRET` från setup-sidan och lägg till i `.env.local`:

```bash
TOTP_SECRET=ABCDEFGHIJKLMNOP...
SESSION_SECRET=din_session_secret
```

### 5. Starta om dev server

```bash
# Ctrl+C för att stoppa
npm run dev
```

### 6. Testa

Besök: `http://localhost:3000/admin`
- Du omdirigeras till `/auth/signin`
- Ange 6-siffrig kod från appen
- Success! Du är inne

## 🔒 Säkerhet

### Fördelar
- ✅ Ingen data lämnar din server
- ✅ Inga Google/Microsoft API-nycklar att hantera
- ✅ Fungerar offline
- ✅ Tidsbegränsade koder (30 sekunder)
- ✅ Kan inte phishas

### Backup
- 📱 1Password lagrar TOTP-koder automatiskt
- 💾 Spara `TOTP_SECRET` säkert (t.ex. i 1Password)
- 🔑 Om du tappar telefon: Använd secret för att återställa i ny app

## 🔧 Production Deployment

### Vercel

1. **Environment Variables:**
   - Gå till Vercel Dashboard → ditt projekt → Settings → Environment Variables
   - Lägg till:
     - `TOTP_SECRET` (från din lokala setup)
     - `SESSION_SECRET` (generera ny med `openssl rand -base64 32`)

2. **Ta bort setup-route:**
   - Efter första deployment, ta bort `/auth/setup` route i production
   - Eller lägg till middleware för att skydda den

3. **Deploy:**
```bash
git add .
git commit -m "Add TOTP authentication"
git push
```

## 📁 Filer som skapades

```
src/
├── lib/
│   └── auth.ts                    # TOTP utilities & session
├── app/
│   ├── api/auth/
│   │   ├── verify/route.ts        # Verifiera TOTP-kod
│   │   └── logout/route.ts        # Logga ut
│   └── auth/
│       ├── setup/page.tsx         # Setup QR-kod (ta bort i prod!)
│       └── signin/page.tsx        # Login med 6-siffrig kod
└── admin/
    ├── page.tsx                   # Protected server component
    └── AdminClient.tsx            # Client form
```

## ❓ Felsökning

### "Invalid TOTP code"
- Kontrollera att tiden på server och telefon är synkad
- TOTP är tidsberoende (± 30 sek tolerans)
- Verifiera att `TOTP_SECRET` är rätt

### "Session fungerar inte"
- Kontrollera att `SESSION_SECRET` är satt
- Starta om dev server efter env changes

### "Setup-sidan visar redan konfigurerad"
- Ta bort `TOTP_SECRET` från `.env.local` tillfälligt
- Ladda om sidan
- Generera ny secret

## 🎯 Användning

### Login
1. Gå till `/admin`
2. Omdirigeras till `/auth/signin`
3. Öppna Google Authenticator/1Password
4. Ange 6-siffrig kod
5. Loggas in i 24h

### Logout
- Klicka "Logga ut"-knapp i admin header
- Session förstörs
- Omdirigeras till login

## 🔐 Best Practices

1. **Aldrig committa secrets:**
   - `.env.local` är i `.gitignore`
   - Använd Vercel environment variables

2. **Backup TOTP_SECRET:**
   - Spara i 1Password eller säker plats
   - Behövs för att återställa efter telefon-förlust

3. **Ta bort `/auth/setup` i production:**
   - Eller skydda med middleware
   - Behövs bara en gång

4. **Session timeout:**
   - Nuvarande: 24h
   - Ändra i `src/lib/auth.ts` → `maxAge`

# Blogg med GitHub Integration

Detta projekt använder GitHub som content backend för blogginlägg.

## Setup

### 1. Skapa ett GitHub repo för dina blogginlägg

```bash
# Skapa nytt repo på GitHub (public)
# T.ex: github.com/wajkie/blogposts
```

### 2. Skapa mappen `content/posts` i repot

```bash
mkdir -p content/posts
git add .
git commit -m "Add content directory"
git push
```

### 3. Skapa GitHub Personal Access Token

1. Gå till GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generera ny token med följande permissions:
   - ✅ `repo` (Full control of private repositories)
3. Kopiera token (syns bara en gång!)

### 4. Konfigurera environment variables

Lokalt (`.env.local`):
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=wajkie
GITHUB_REPO=blogposts
```

På Vercel:
1. Project Settings → Environment Variables
2. Lägg till samma variabler

## Hur det fungerar

### Skriv inlägg
1. Gå till `/admin`
2. Skriv markdown-innehåll
3. Klicka "Spara" → Pushas till GitHub

### Visa inlägg
1. Besökare går till `/blog`
2. Vercel hämtar `.md` filer från GitHub **runtime**
3. Cachar i 60 sekunder (ISR)
4. **Ingen rebuild behövs!**

## Deployment

```bash
# Pusha till GitHub
git push

# Vercel deployer automatiskt
# Lägg till env vars i Vercel dashboard
```

## Struktur i blogposts-repo

```
content/
  posts/
    my-first-post.md
    another-post.md
    hello-world.md
```

Varje fil blir tillgänglig på `/blog/[filename]`

## ISR (Incremental Static Regeneration)

- Sidor cachas i 60 sekunder
- Efter 60s hämtas nytt innehåll från GitHub
- Snabb för besökare, uppdateras automatiskt

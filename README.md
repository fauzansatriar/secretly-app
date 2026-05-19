# Secretly — Secure Digital Legacy Platform

<p align="center">
  <strong>Protect your digital legacy with military-grade encryption.</strong><br>
  Store secrets, schedule messages, and ensure your loved ones are never left without answers.
</p>

---

## Features

- **Encrypted Vault** — Store passwords, documents, notes with AES-256-GCM encryption
- **Scheduled Messages** — Write encrypted messages delivered at a future date
- **Emergency Contacts** — Designate trusted people to be notified
- **Dead-Man Switch** — Automated check-in system with configurable intervals
- **Zero-Knowledge** — Server never sees plaintext data
- **Row Level Security** — Database-level access control via Supabase RLS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Auth & DB | Supabase (PostgreSQL) |
| Encryption | Web Crypto API (AES-256-GCM) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/secretly-app.git
cd secretly-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:

```bash
# Copy contents of supabase/migrations/0001_initial_schema.sql
# and execute in the Supabase SQL Editor
```

3. Go to **Settings → API** to get your project URL and anon key.

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/secretly-app)

### Manual Deploy

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy!

### Post-Deploy Checklist

- [ ] Run SQL migration in Supabase
- [ ] Configure auth redirect URLs in Supabase: `https://your-domain.com/auth/callback`
- [ ] (Optional) Enable Google OAuth in Supabase → Authentication → Providers
- [ ] (Optional) Set up Supabase Edge Functions for scheduled message delivery

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Next.js    │────▶│   Supabase   │
│  (Client)    │     │   (Vercel)   │     │  (Postgres)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       │  AES-256-GCM                           │  RLS Policies
       │  Encrypt/Decrypt                       │  Per-user isolation
       │  (client-only)                         │
       ▼                                         ▼
  Plaintext NEVER                          Only ciphertext
  leaves the browser                       stored in DB
```

## Encryption Model

1. On first login, a random AES-256-GCM key is generated client-side
2. Key is stored in `sessionStorage` (cleared on tab close)
3. All vault items and message content are encrypted before any API call
4. Server and database only ever see base64 ciphertext + IV
5. Decryption happens exclusively in the browser

## Project Structure

```
secretly-app/
├── app/
│   ├── (auth)/login, signup       # Auth flow
│   ├── (dashboard)/               # Protected area
│   │   ├── dashboard/             # Overview
│   │   ├── vault/                 # Encrypted vault CRUD
│   │   ├── contacts/              # Emergency contacts
│   │   ├── messages/              # Scheduled messages
│   │   ├── deadman/               # Dead-man switch
│   │   └── settings/              # Account settings
│   ├── auth/callback/             # OAuth callback
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # shadcn primitives
│   └── dashboard/                 # Layout components
├── lib/
│   ├── crypto/encryption.ts       # AES-GCM utilities
│   ├── supabase/                  # Client/server/middleware
│   ├── types.ts                   # TypeScript interfaces
│   └── utils.ts                   # Helpers
├── supabase/migrations/           # SQL schema
└── middleware.ts                   # Auth route protection
```

## Business Model

| Feature | Free | Pro ($9/mo) |
|---------|------|-------------|
| Vault Items | 5 | Unlimited |
| Emergency Contacts | 1 | Unlimited |
| Scheduled Messages | 1 | Unlimited |
| Storage | 50 MB | 10 GB |
| Dead-Man Switch | Basic | Advanced |
| File/Video Upload | — | ✓ |
| Family Sharing | — | ✓ |
| Archive Export | — | ✓ |

## License

MIT

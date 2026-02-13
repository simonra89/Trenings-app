# Treningsapp

Mobilvennlig Next.js-app for styrkelogging med innlogging, programmer, progresjon (1RM) og eksport til CSV/XLSX.

## Funksjoner
- Registrering/innlogging (NextAuth Credentials + bcrypt)
- Egen data per bruker
- Øvelser (standard seed + egendefinerte + arkivering)
- Programmer med dager og øvelser
- Start treningsøkt fra program
- Treningslogg med sett (kg, reps, RIR, notat) og autosave
- Progresjonsside per øvelse med 1RM-graf og volum
- Eksport av treningssett i valgt periode til CSV/XLSX

## Teknologi
- Next.js App Router + TypeScript
- Tailwind CSS + enkle shadcn-inspirerte UI-komponenter
- Prisma ORM + SQLite (lokalt)
- Klargjort `.env` felt for Postgres

## Kom i gang
1. Kopier miljøvariabler:
   ```bash
   cp .env.example .env
   ```
2. Installer avhengigheter:
   ```bash
   npm install
   ```
3. Generer Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Kjør migrering:
   ```bash
   npm run prisma:migrate -- --name init
   ```
5. Seed standardøvelser:
   ```bash
   npm run prisma:seed
   ```
6. Start dev-server:
   ```bash
   npm run dev
   ```
7. Åpne `http://localhost:3000`.

## Bruk
- Registrer bruker på `/register`
- Opprett øvelser på `/exercises`
- Opprett program på `/programs/new`
- Start økt fra programdetalj eller opprett tom økt på `/workouts/new`
- Logg sett i `/workouts/[id]`
- Se progresjon ved å åpne øvelse -> "Progresjon"
- Eksporter data fra `/export`

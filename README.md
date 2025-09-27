# Eazy Lingo

A full-stack vocabulary trainer where users create sets of words and learn them with a clean, focused UI. The app supports user sets, ready-made (common) sets, and a training flow with flip cards, progress tracking, and tense toggles.

## ✨ Features

- **User sets**
  - Create, list, open and learn your word sets
  - Add existing words to a set; remove words from a set
- **Common sets**
  - View ready-made (shared) sets for a quick start
- **Learning flow**
  - Flip-card question/answer with tense toggle (Present/Perfect)
  - Inline validation with clear feedback and progress bar
- **Auth**
  - JWT with refresh
  - Google OAuth strategy present on the server

## 🧱 Tech Stack

**Client**
- Next.js 14 (App Router), React 18
- SWR (data fetching/cache), axios
- TailwindCSS + shadcn/ui, lucide-react

**Server**
- NestJS 10 (controllers / services / guards / strategies)
- Prisma ORM + PostgreSQL
- Passport strategies: local, JWT, Google OAuth


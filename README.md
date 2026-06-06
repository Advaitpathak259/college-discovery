# 🎓 College Discovery

A modern college discovery and comparison platform built using **Next.js 15**, **TypeScript**, **Prisma**, **PostgreSQL (Neon)**, and **Tailwind CSS**.

Users can search colleges, explore admission cutoffs, compare institutions, analyze placements, view fee structures, and make informed college decisions.

---

##  Features

###  College Search
- Search colleges instantly
- Search by name
- Search by short name
- Fast server-side filtering

### College Details Page
Each college includes:

- Overview
- Programs Offered
- Fees
- Placements
- Rankings
- Admission Cutoffs
- Basic Information

###  College Comparison
Compare two colleges side-by-side:

- Fees
- Average Package
- Highest Package
- Placement Rate
- Rankings
- Ratings
- Ownership
- Establishment Year

###  Exam Wise Cutoffs
Supported Exams:

- JEE Main
- JEE Advanced
- BITSAT
- VITEEE
- NEET
- CAT

Filters:

- Exam
- Category
- Quota
- College
- Rank Range

###  Placement Analytics

Track:

- Average Package
- Median Package
- Highest Package
- Placement Rate

###  Rankings

Supports:

- NIRF Rankings
- Future ranking providers

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend

- Next.js Server Components
- Prisma ORM

## Database

- PostgreSQL
- Neon Database

## Deployment

- Docker
- AWS
- GitHub Actions

---

#  Project Structure

```bash
app/
│
├── page.tsx
│
├── college/
│   └── [slug]/
│       └── page.tsx
│
├── compare/
│   └── page.tsx
│
├── exams/
│   └── page.tsx
│
├── api/
│
components/
│
├── home/
├── college/
├── compare/
├── exam/
│
lib/
│
└── prisma.ts
│
prisma/
│
├── schema.prisma
└── seed.ts
│
data/
│
├── colleges.ts
├── programs.ts
├── placements.ts
├── cutoffs.ts
└── rankings.ts
```

---

# 🗄 Database Design

```text
State
│
├── College
│     ├── Program
│     │     ├── Fees
│     │     └── Admissions
│     │
│     ├── Placements
│     ├── Rankings
│     ├── Reviews
│     └── Stats
│
├── Exam
├── Category
└── Quota
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone <repository-url>

cd college-discovery
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment Variables

Create:

```bash
.env
```

Add:

```env
DATABASE_URL=your_neon_database_url
```

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run Migrations

```bash
npx prisma migrate dev
```

## 6. Seed Database

```bash
npm run seed
```

or

```bash
tsx prisma/seed.ts
```

## 7. Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---




# 📈 Current Modules

✅ College Search

✅ College Details

✅ College Comparison

✅ Exam Wise Cutoffs

✅ Placements

✅ Rankings

✅ Responsive UI

✅ Prisma + PostgreSQL

✅ Seeded Data System

---


# College Comparison

Backend APIs for a college discovery and decision-making platform.

Chosen role: Backend Engineer  
Chosen track: Track B - College Discovery Platform

## Features

1. College listing with search, filters, sorting, and pagination
2. College detail API with courses, placements, and reviews
3. College comparison API for 2-3 colleges
4. Predictor API using exam, rank, and cutoff data

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Zod validation

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file using `.env.example`:

```bash
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL="postgresql://username:password@localhost:5432/college_comparison?schema=public"
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Seed sample data:

```bash
npm run db:seed
```

Start development server:

```bash
npm run dev
```

Health check:

```txt
GET /health
```

## API Endpoints

### Colleges

```txt
GET /api/v1/colleges
```

Query params:

```txt
page
limit
search
city
state
ownership
minFees
maxFees
sortBy
sortOrder
```

Example:

```txt
GET /api/v1/colleges?search=iit&page=1&limit=10&sortBy=ranking&sortOrder=asc
```

### College Details

```txt
GET /api/v1/colleges/:collegeId
```

Returns one college with courses, placements, and recent reviews.

### Compare Colleges

```txt
GET /api/v1/colleges/compare?ids=collegeId1,collegeId2
```

Supports comparing 2-3 colleges.

### Predictor

```txt
GET /api/v1/predictor?exam=JEE Advanced&rank=400
```

Optional query params:

```txt
category
limit
```

Returns colleges where the user's rank is within the stored cutoff range.

## Backend Architecture

- `src/app.js` configures Express middleware and routes.
- `src/controllers` contains request handling and database queries.
- `src/routes` maps API URLs to controllers.
- `src/validators` validates query params and route params using Zod.
- `src/middleware` contains shared Express middleware.
- `prisma/schema.prisma` defines the PostgreSQL schema.
- `prisma/seed.js` adds sample data for API testing.

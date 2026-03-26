# Todo App

A clean, responsive todo application built with **Next.js 15** and **Tailwind CSS**. No backend or database required — all data lives in React state, with demo todos pre-loaded on start.

## Features

- **Add, edit, and delete todos** — full CRUD via in-memory state
- **Complete/uncomplete todos** — click the circle checkbox on any item
- **Priority levels** — high, medium, low (colour-coded)
- **Categories** — work, personal, shopping, health
- **Due dates** — overdue items are highlighted in red
- **Search** — filter todos by title or description
- **Status filter** — view all, active, or completed todos
- **Priority & category filters** — narrow down the list
- **Progress bar** — shows overall completion percentage
- **Stats panel** — active, done, and urgent counts at a glance
- **Clear completed** — bulk-remove finished todos
- **Dark mode** — follows the system colour scheme

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | TypeScript |
| State | React `useState` / `useMemo` (no external store) |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |

## Project Structure

```
app/
├── __tests__/
│   ├── data.test.ts         # Demo data shape and integrity
│   ├── StatsBar.test.tsx    # Progress and count calculations
│   ├── TodoForm.test.tsx    # Add / edit form behaviour
│   └── TodoItem.test.tsx    # Rendering, callbacks, overdue logic
├── components/
│   ├── TodoApp.tsx          # Root client component — holds all state
│   ├── TodoItem.tsx         # Single todo row with actions
│   ├── TodoForm.tsx         # Add / edit form (shared)
│   ├── FilterBar.tsx        # Search, status, priority, category filters
│   └── StatsBar.tsx         # Progress bar and summary counts
├── data.ts                  # Pre-loaded demo todos
├── types.ts                 # Todo, Priority, Category types
├── layout.tsx               # Root layout + metadata
├── page.tsx                 # Entry point — renders <TodoApp />
└── globals.css              # Tailwind base import
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

## Testing

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage
```

Tests use **Vitest** with **Testing Library** and **jsdom**. The coverage report is written to `coverage/` (gitignored).

## CI

| Workflow | Trigger | Steps |
|---|---|---|
| **PR Checks** | Pull request → `main` | Install → Build → Test + Coverage → Upload coverage artifact |
| **Main Build** | Push to `main` | Install → Build |

Workflow files live in `.github/workflows/`.

## Demo Data

Eight sample todos are loaded from `app/data.ts` on first render. They cover a mix of priorities, categories, and completion states so every feature is visible immediately. Because there is no persistence layer, refreshing the page resets to this demo set.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new):

1. Push this repository to GitHub
2. Import the repo in Vercel
3. Click **Deploy** — no environment variables required

# UPSC MCQ Generator

Quiz app for UPSC preparation using AI (Gemini).

## Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS (port 3000)
- **Backend:** Cloudflare Workers + Hono (port 8787)
- **Database:** Cloudflare D1 (SQLite)
- **AI:** Gemini 3 Flash Preview

## Quick Start
```bash
pnpm install
cd apps/worker && npx wrangler d1 migrations apply upsc-mcq-db --local
# Terminal 1: cd apps/worker && pnpm dev
# Terminal 2: cd apps/web && pnpm dev
```

## Key Files
| File | Purpose |
|------|---------|
| `apps/web/src/app/page.tsx` | Dashboard |
| `apps/web/src/app/quiz/new/page.tsx` | Quiz creation |
| `apps/web/src/app/quiz/[id]/page.tsx` | Take quiz |
| `apps/web/src/components/ContributionGraph.tsx` | Activity heatmap (3 months) |
| `apps/web/src/components/PerformanceGraph.tsx` | Correct/wrong chart |
| `apps/web/src/components/GenerationProgress.tsx` | Shimmer progress text |
| `apps/worker/src/services/llm.ts` | Gemini integration |
| `apps/worker/src/routes/` | API endpoints |

## Design Tokens
- **Primary color:** #0066ff (nicknamed "#dk")
- **Card shadows:** `shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.04)]`

## Notes
- `is_correct` in DB is INTEGER (0/1), convert to boolean in API
- `style` column stores JSON array (handle old string format too)
- Local dev: set `CORS_ORIGIN=http://localhost:3000` in wrangler.toml
- Question count presets: 40, 80, 120, 160

## Deployment
- **API:** `cd apps/worker && npx wrangler deploy`
- **Frontend:** Auto-deploys via GitHub → Cloudflare Pages
- **Live:** https://mcqs.dhrumilkherde.com

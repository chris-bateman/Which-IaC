# Which IaC

A transparent, static Next.js 16+ site that helps users choose between infrastructure and automation tools using auditable data and rules.

## Features
- Static export ready for GitHub Pages
- Data-driven questionnaire and comparison views
- Transparent decision engine with hard exclusions and weighted rules
- Per-tool fact pages with official references
- Minimal, accessible UI

## Project structure
```
src/data/tools.json      # Tool facts and official references
src/data/questions.json  # Questionnaire content
src/data/rules.json      # Must-have exclusions and weighted scoring
src/lib/recommend.ts     # Recommendation engine
```

## Local development
```
npm install
npm run dev
```
Open `http://localhost:3000/`.

## Static export (Pages preview)
```
NEXT_PUBLIC_BASE_PATH="" npm run build
npx serve out
```
Open the URL printed by `serve`.

## GitHub Pages deployment
- `next.config.js` uses a base path for production builds. This repo expects `/Which-IaC`.
- The deploy workflow sets `NEXT_PUBLIC_BASE_PATH=/Which-IaC` during build.
- The workflow in `.github/workflows/deploy.yml` builds and uploads the `out` directory.

## Recommendation engine behavior
1. Apply hard exclusions first (must-have requirements).
2. Apply weighted scoring second.
3. Produce explanations per tool (rules fired and why they matter).
4. Show excluded tools with exact reasons.

## Adding a tool
- Add the tool facts to `src/data/tools.json`, including official documentation links.
- Keep facts strictly factual and sourced from primary docs.
- Update `src/app/tools/[tool]/page.tsx` only if you add new fields to the schema.
- Run `npm run build` to ensure the static tool page is generated.

## Adding questions or rules
- Add or edit questions in `src/data/questions.json`.
- Add or edit rules in `src/data/rules.json`:
  - Use `mustHave` for hard exclusions.
  - Use `weights` for preference scoring.
- Update tests in `src/lib/recommend.test.ts` for new rule behavior.

## Contributing
See `CONTRIBUTING.md` for fact sourcing, rule changes, and language guidelines.

## Tests
```
npm run test
```
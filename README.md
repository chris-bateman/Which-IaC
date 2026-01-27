# Which IaC

A transparent, static Next.js 16+ site that helps users choose between infrastructure and automation tools using auditable data and rules.

## Features
- Static export ready for GitHub Pages
- Data-driven questionnaire and comparison views
- Transparent decision engine with hard exclusions and weighted rules
- Per-tool fact pages with official references
- About page that explains questions and rules
- Minimal, accessible UI

## Project structure
```
src/data/tools.json      # Tool facts and official references
src/data/questions.json  # Questionnaire content
src/data/rules.json      # Must-have exclusions and weighted scoring
src/lib/recommend.ts     # Recommendation engine
```

## Data files

### `src/data/tools.json`
- Array of tool objects used across compare/results/detail pages.
- Required fields: `id`, `name`, `summary`, `focus`, `primaryTargets`, `definitionModel`,
  `supportedLanguages`, `stateModel`, `executionModel`, `officialDocs`.
- `id` must be unique and URL-safe (used in `/tools/[tool]/` routes).
- `officialDocs` must include primary/official sources and are shown as references in the UI.
Example:
```json
{
  "id": "example-tool",
  "name": "Example Tool",
  "summary": "One-line factual summary.",
  "focus": "Infrastructure provisioning",
  "primaryTargets": ["AWS"],
  "definitionModel": "Declarative templates",
  "supportedLanguages": ["YAML", "JSON"],
  "stateModel": "Service-managed",
  "executionModel": "CLI applies templates",
  "officialDocs": [
    { "label": "Official Docs", "url": "https://example.com/docs" }
  ]
}
```

### `src/data/questions.json`
- Array of question objects that drive the quiz.
- Required fields: `id`, `prompt`, `helpText` (optional), `type`, `options`.
- Each `options` entry should include `value` and `label` (label is what users see).
- `id` values are referenced by rules in `rules.json`.
Example:
```json
{
  "id": "target_scope",
  "prompt": "What is your primary target scope?",
  "helpText": "This influences AWS-only vs multi-cloud tooling.",
  "type": "single",
  "options": [
    { "value": "aws_only", "label": "AWS only" },
    { "value": "multi_cloud", "label": "Multi-cloud" }
  ]
}
```

### `src/data/rules.json`
- `mustHave`: hard exclusions (applied first).
- `weights`: preference-based scoring (applied after exclusions).
- Each rule must reference a valid `questionId`.
- Weight maps must use tool `id`s from `tools.json`.
Example:
```json
{
  "id": "w-aws-only",
  "questionId": "target_scope",
  "match": { "equals": "aws_only" },
  "weights": { "aws-cdk": 3, "terraform": 0 },
  "message": "Primary target is AWS only."
}
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

## About page
- `/about/` explains the question set and rule logic.
- Weighted rule details are shown only on the About page.

## Adding a tool
- Add the tool facts to `src/data/tools.json`, including official documentation links.
- Keep facts strictly factual and sourced from primary docs.
- Ensure the tool `id` is unique and URL-safe.
- Update `src/app/tools/[tool]/page.tsx` only if you add new fields to the schema.
- Add the tool to at least one rule (see test guard).
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

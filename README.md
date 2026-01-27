# Which IaC

A site that helps users choose between infrastructure and automation tools using auditable data and rules.

## Features
- Static export ready for GitHub Pages
- Data-driven questionnaire and comparison views
- Transparent decision engine with hard exclusions and weighted rules
- Per-tool fact pages with official references
- About page that explains questions and rules
- Playwright end-to-end tests for quiz, compare, and about flows
- Minimal, accessible UI

## Quick Start
- Prerequisites: Node.js 18+ and npm
- Install and run locally:
```
npm install
npm run dev
```
Open `http://localhost:3000/`.

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
- When official sources do not explicitly state a detail (for example, `primaryTargets`), use the explicit placeholder `"Not stated in official docs"` rather than inference.
- Common `focus` categories used in this project include: "Infrastructure provisioning", "Configuration management", and "Control plane and orchestration".
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

## Development & tests
```
npm install
npm run dev
npm run test
npm run test:e2e
```

## End-to-end tests (Playwright)
```
npx playwright install --with-deps
npm run test:e2e
```
The HTML report is generated in `playwright-report/`. Open it with:
```
npx playwright show-report
```

## Static export (local preview)
```
NEXT_PUBLIC_BASE_PATH="" npm run build
npx serve out
```
Open the URL printed by `serve`.

## GitHub Pages deployment
- `next.config.js` uses a base path for production builds. This repo expects `/Which-IaC`.
- The deploy workflow should set `NEXT_PUBLIC_BASE_PATH=/Which-IaC` during build.
- Ensure a workflow exists at `.github/workflows/deploy.yml` that builds and uploads the `out` directory.

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
See `CONTRIBUTING.md` for fact sourcing, rule changes, language guidelines, and the PR checklist.

 

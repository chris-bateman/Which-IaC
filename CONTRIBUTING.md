# Contributing

Thanks for helping improve Which IaC. Please follow these guidelines so the project remains factual, auditable, and unbiased.

## Facts and sources
 - If a detail is not explicitly stated in official sources (e.g., `primaryTargets`), use the placeholder "Not stated in official docs" instead of inferring.

## Contribution workflow
 - Accepted `focus` categories in this project include: "Infrastructure provisioning", "Configuration management", and "Control plane and orchestration".
- Facts in `src/data/tools.json` include primary sources in `officialDocs`.
- Rule or weight changes include a clear rationale in the PR description.

## Adding a tool (other IaC frameworks)
 - Where official docs are silent, placeholders like "Not stated in official docs" are used explicitly without inference.
### `src/data/tools.json`
- Add the tool entry and include official documentation links.
- Keep fields consistent with existing tools; update UI only if you add new fields.
- Use a short, factual summary without evaluative language.
- `id` must be unique, URL-safe, and stable (used for routing and rules).
- `officialDocs` should contain primary sources (docs, GitHub, product pages).

### `src/data/questions.json`
- Add or update questions when new criteria are needed.
- Keep prompts neutral and avoid subjective comparisons.
- Ensure each question `id` is referenced by rules where appropriate.

### `src/data/rules.json`
- `mustHave` rules are hard exclusions.
- `weights` rules add preference scoring.
- Use tool `id`s from `tools.json` only.
- Provide a clear rationale in the PR description for any rule/weight change.

After adding a tool, ensure it appears in at least one rule (test will fail if it does not).

## Rules and weights
- Changes to `src/data/rules.json` must include a clear rationale in the pull request description.
- Keep rules explicit and easy to audit.
- Avoid subjective criteria unless clearly labeled as a proxy and backed by data.

## Questions
- Update `src/data/questions.json` when adding or changing a rule’s input.
- Keep questions factual and avoid preference framing that implies a “best” tool.
- If you add or remove a question, confirm the quiz UI still flows and update tests.

## Language
- Use neutral, factual language.
- Do not use superlatives (for example: "best", "easiest", "enterprise-ready").

## Testing
- Run `npm run test` before submitting changes.

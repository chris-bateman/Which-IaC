# Contributing

Thanks for helping improve WhichIaC. Please follow these guidelines so the project remains factual, auditable, and unbiased.

## Facts and sources
- Facts in `src/data/tools.json` must link to primary or official sources.
- If you add or change a fact, include the official reference in the `officialDocs` list.
- Avoid claims that are subjective or hard to validate.

## Adding a tool (other IaC frameworks)
- Add the tool entry to `src/data/tools.json` and include official documentation links.
- Keep fields consistent with existing tools; update UI only if you add new fields.
- Add a short, factual summary without evaluative language.
- Ensure `generateStaticParams` in `src/app/tools/[tool]/page.tsx` picks up the new tool (it reads the JSON automatically).

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

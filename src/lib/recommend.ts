import tools from '../data/tools.json';
import rules from '../data/rules.json';

export type AnswerMap = Record<string, string>;

type MatchRule = { equals: string } | { anyOf: string[] };

export type FiredRule = { ruleId: string; weight: number; message: string };

export type RankedTool = {
  toolId: string;
  score: number;
  firedRules: FiredRule[];
};

export type ExcludedTool = { toolId: string; reasons: string[] };

export type RecommendationResult = {
  ranked: RankedTool[];
  excluded: ExcludedTool[];
};

type MustHaveRule = {
  id: string;
  questionId: string;
  match: MatchRule;
  excludes: string[];
  reason: string;
};

type WeightRule = {
  id: string;
  questionId: string;
  match: MatchRule;
  weights: Record<string, number>;
  message: string;
};

const matchesRule = (answer: string | undefined, match: MatchRule): boolean => {
  if (!answer) return false;
  if ('equals' in match) return answer === match.equals;
  return match.anyOf.includes(answer);
};

export const recommend = (answers: AnswerMap): RecommendationResult => {
  const excludedReasons = new Map<string, Set<string>>();
  const mustHaveRules = rules.mustHave as MustHaveRule[];
  const weightRules = rules.weights as WeightRule[];

  for (const rule of mustHaveRules) {
    const answer = answers[rule.questionId];
    if (!matchesRule(answer, rule.match)) continue;
    for (const toolId of rule.excludes) {
      if (!excludedReasons.has(toolId)) {
        excludedReasons.set(toolId, new Set<string>());
      }
      excludedReasons.get(toolId)?.add(rule.reason);
    }
  }

  const ranked: RankedTool[] = [];

  for (const tool of tools) {
    if (excludedReasons.has(tool.id)) continue;

    let score = 0;
    const firedRules: FiredRule[] = [];

    for (const rule of weightRules) {
      const answer = answers[rule.questionId];
      if (!matchesRule(answer, rule.match)) continue;
      const weight = Number(rule.weights[tool.id] ?? 0);
      if (Number.isNaN(weight) || weight === 0) continue;
      score += weight;
      firedRules.push({ ruleId: rule.id, weight, message: rule.message });
    }

    ranked.push({ toolId: tool.id, score, firedRules });
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aName = tools.find((tool) => tool.id === a.toolId)?.name ?? a.toolId;
    const bName = tools.find((tool) => tool.id === b.toolId)?.name ?? b.toolId;
    return aName.localeCompare(bName);
  });

  const excluded: ExcludedTool[] = Array.from(excludedReasons.entries())
    .map(([toolId, reasons]) => ({ toolId, reasons: Array.from(reasons) }))
    .sort((a, b) => {
      const aName = tools.find((tool) => tool.id === a.toolId)?.name ?? a.toolId;
      const bName = tools.find((tool) => tool.id === b.toolId)?.name ?? b.toolId;
      return aName.localeCompare(bName);
    });

  return { ranked, excluded };
};

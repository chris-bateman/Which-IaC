import toolsData from './tools.json';
import rulesData from './rules.json';
import questionsData from './questions.json';

export type Tool = typeof toolsData[number];
export type Question = typeof questionsData[number];
export type Rules = typeof rulesData;

export const tools = toolsData as Tool[];
export const questions = questionsData as Question[];
export const rules = rulesData as Rules;

export const toolById = new Map<string, Tool>(
  tools.map((tool) => [tool.id, tool])
);

export const getToolById = (toolId: string) => toolById.get(toolId);

export const getToolName = (toolId: string) => toolById.get(toolId)?.name ?? toolId;

export const requireToolById = (toolId: string, context?: string): Tool => {
  const tool = toolById.get(toolId);
  if (tool) return tool;
  const detail = context ? ` (${context})` : '';
  throw new Error(`Unknown tool id: ${toolId}${detail}`);
};

const assertKnownToolId = (toolId: string, context: string) => {
  if (!toolById.has(toolId)) {
    throw new Error(`Unknown tool id: ${toolId} (referenced in ${context})`);
  }
};

const validateRules = () => {
  for (const rule of rules.mustHave) {
    for (const toolId of rule.excludes ?? []) {
      assertKnownToolId(toolId, `rules.mustHave:${rule.id}`);
    }
  }
  for (const rule of rules.weights) {
    for (const toolId of Object.keys(rule.weights ?? {})) {
      assertKnownToolId(toolId, `rules.weights:${rule.id}`);
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  validateRules();
}

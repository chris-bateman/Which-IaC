import { describe, expect, it } from 'vitest';
import { recommend } from './recommend';
import tools from '../data/tools.json';
import rules from '../data/rules.json';

const baseAnswers = {
  cloudformation_required: 'no',
  language_preference: 'no_preference',
  automation_focus: 'unsure',
  target_scope: 'unsure',
  state_backend_responsibility: 'self_managed',
  managed_state: 'unsure'
};

describe('recommend', () => {
  it('handles empty answers without exclusions or scores', () => {
    const result = recommend({});

    expect(result.excluded).toEqual([]);
    expect(result.ranked.map((item) => item.score)).toEqual(
      Array(tools.length).fill(0)
    );
  });

  it('applies hard exclusions before scoring', () => {
    const result = recommend({
      ...baseAnswers,
      cloudformation_required: 'yes'
    });

    const excludedIds = result.excluded.map((item) => item.toolId).sort();
    expect(excludedIds).toEqual([
      'ansible',
      'chef',
      'crossplane',
      'formae',
      'opentofu',
      'pulumi',
      'puppet',
      'terraform'
    ]);
    expect(result.ranked.map((item) => item.toolId)).toEqual([
      'aws-cdk',
      'aws-cloudformation'
    ]);
  });

  it('weights state-backend preference without excluding tools', () => {
    const result = recommend({
      ...baseAnswers,
      state_backend_responsibility: 'tool_managed'
    });

    const scores = new Map(result.ranked.map((item) => [item.toolId, item.score]));
    expect(scores.get('aws-cdk')).toBeGreaterThan(scores.get('terraform') ?? 0);
    expect(scores.get('aws-cloudformation')).toBeGreaterThan(scores.get('opentofu') ?? 0);
  });

  it('applies weighted scoring and sorts by score', () => {
    const result = recommend({
      ...baseAnswers,
      language_preference: 'declarative',
      target_scope: 'multi_cloud'
    });

    const rankedIds = result.ranked.map((item) => item.toolId);
    expect(rankedIds.slice(0, 3)).toEqual(['opentofu', 'terraform', 'crossplane']);
  });

  it('orders ties by tool name deterministically', () => {
    const result = recommend({
      ...baseAnswers,
      target_scope: 'unsure',
      language_preference: 'no_preference'
    });

    const namesById = new Map(tools.map((tool) => [tool.id, tool.name]));
    const rankedNames = result.ranked.map((item) => namesById.get(item.toolId));
    const sortedNames = [...rankedNames].sort((a, b) =>
      (a ?? '').localeCompare(b ?? '')
    );

    expect(rankedNames).toEqual(sortedNames);
  });

  it('returns fired rules with weights and messages', () => {
    const result = recommend({
      ...baseAnswers,
      language_preference: 'declarative'
    });

    const terraform = result.ranked.find((item) => item.toolId === 'terraform');
    expect(terraform).toBeTruthy();
    expect(terraform?.firedRules.length).toBeGreaterThan(0);
    expect(terraform?.firedRules[0]).toHaveProperty('ruleId');
    expect(terraform?.firedRules[0]).toHaveProperty('weight');
    expect(terraform?.firedRules[0]).toHaveProperty('message');
  });

  it('includes explicit exclusion reasons', () => {
    const result = recommend({
      ...baseAnswers,
      cloudformation_required: 'yes'
    });

    const terraformExclusion = result.excluded.find((item) => item.toolId === 'terraform');
    const rule = rules.mustHave.find((item) => item.id === 'mh-cloudformation');

    expect(terraformExclusion?.reasons).toContain(rule?.reason);
  });

  it('only references known tools in rule weights', () => {
    const toolIds = new Set(tools.map((tool) => tool.id));
    const weightKeys = Object.values(rules.weights)
      .flatMap((rule) => Object.keys(rule.weights));

    for (const key of weightKeys) {
      expect(toolIds.has(key)).toBe(true);
    }
  });

  it('requires each tool to appear in at least one rule', () => {
    const toolIds = tools.map((tool) => tool.id);
    const referenced = new Set<string>();

    for (const rule of rules.mustHave) {
      for (const toolId of rule.excludes) referenced.add(toolId);
    }
    for (const rule of rules.weights) {
      for (const toolId of Object.keys(rule.weights)) referenced.add(toolId);
    }

    for (const toolId of toolIds) {
      expect(referenced.has(toolId)).toBe(true);
    }
  });
});

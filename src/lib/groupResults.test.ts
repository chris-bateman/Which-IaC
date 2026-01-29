import { describe, expect, it } from 'vitest';
import { recommend } from './recommend';
import { groupResults } from './groupResults';

const baseAnswers = {
  cloudformation_required: 'no',
  language_preference: 'no_preference',
  automation_focus: 'unsure',
  control_plane_opt_in: 'unsure',
  target_scope: 'unsure',
  state_backend_responsibility: 'self_managed',
  managed_state: 'unsure'
};

describe('groupResults', () => {
  it('allows Strong fit to be empty when thresholds are not met', () => {
    const result = recommend({
      ...baseAnswers,
      automation_focus: 'config_management'
    });
    const groups = groupResults(result, {
      ...baseAnswers,
      automation_focus: 'config_management'
    });

    const strong = groups.find((group) => group.id === 'strong-fit');
    expect(strong).toBeTruthy();
    expect(strong?.items.length).toBe(0);
  });

  it('caps strong fit when a blocker applies', () => {
    const answers = {
      ...baseAnswers,
      language_preference: 'general_purpose',
      automation_focus: 'config_management',
      target_scope: 'aws_native',
      state_backend_responsibility: 'tool_managed'
    };
    const result = recommend(answers);
    const groups = groupResults(result, answers);

    const strong = groups.find((group) => group.id === 'strong-fit');
    const viable = groups.find((group) => group.id === 'viable-tradeoffs');
    const strongIds = new Set(strong?.items.map((item) => item.toolId));
    const viableIds = new Set(viable?.items.map((item) => item.toolId));

    expect(strongIds.has('aws-cdk')).toBe(false);
    expect(viableIds.has('aws-cdk')).toBe(true);
  });
});

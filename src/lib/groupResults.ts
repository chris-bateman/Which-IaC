import { getToolById } from '../data';
import type { AnswerMap, RecommendationResult } from './recommend';

export type GroupedItem = RecommendationResult['ranked'][number] & {
  fitSignals: RecommendationResult['ranked'][number]['firedRules'];
  conflicts: RecommendationResult['ranked'][number]['firedRules'];
  matchCount: number;
  conflictCount: number;
  hasBlocker: boolean;
};

export type GroupedResult = {
  id: 'strong-fit' | 'viable-tradeoffs' | 'weak-fit';
  title: string;
  items: GroupedItem[];
  emptyMessage?: string;
};

const strongThreshold = 6;
const viableThreshold = 2;

const getFocusCategory = (focus: string) => {
  const normalized = focus.toLowerCase();
  if (normalized.includes('control plane')) return 'control_plane';
  if (normalized.includes('configuration management')) return 'config_management';
  if (normalized.includes('infrastructure provisioning')) return 'infra_provisioning';
  return 'unknown';
};

export const groupResults = (
  result: RecommendationResult,
  answers: AnswerMap
): GroupedResult[] => {
  const enriched: GroupedItem[] = result.ranked.map((item) => {
    const fitSignals = item.firedRules.filter((rule) => rule.weight > 0);
    const conflicts = item.firedRules.filter((rule) => rule.weight < 0);
    const tool = getToolById(item.toolId);
    const focusCategory = tool ? getFocusCategory(tool.focus) : 'unknown';
    const focusMismatch =
      answers.automation_focus === 'infra_provisioning'
        ? focusCategory !== 'infra_provisioning'
        : answers.automation_focus === 'config_management'
          ? focusCategory !== 'config_management'
          : answers.automation_focus === 'control_plane'
            ? focusCategory !== 'control_plane'
            : false;
    const controlPlaneBlocker =
      answers.control_plane_opt_in === 'no' && focusCategory === 'control_plane';
    const hasBlocker = focusMismatch || controlPlaneBlocker;

    return {
      ...item,
      fitSignals,
      conflicts,
      matchCount: fitSignals.length,
      conflictCount: conflicts.length,
      hasBlocker
    };
  });

  const strongFit = enriched.filter(
    (item) => item.score >= strongThreshold && !item.hasBlocker
  );
  const viableWithTradeoffs = enriched.filter(
    (item) =>
      item.score >= viableThreshold &&
      !(item.score >= strongThreshold && !item.hasBlocker)
  );
  const weakFit = enriched.filter((item) => item.score < viableThreshold);

  const groups: GroupedResult[] = [
    {
      id: 'strong-fit',
      title: 'Strong fit',
      items: strongFit,
      emptyMessage:
        'No tools match all your preferences cleanly. These are the closest options and where they trade off.'
    }
  ];

  if (viableWithTradeoffs.length > 0) {
    groups.push({
      id: 'viable-tradeoffs',
      title: 'Viable with trade-offs',
      items: viableWithTradeoffs
    });
  }

  if (weakFit.length > 0) {
    groups.push({
      id: 'weak-fit',
      title: 'Weak fit',
      items: weakFit
    });
  }

  return groups;
};

import type { AnswerMap } from './recommend';

const LEGACY_STATE_QUESTION_ID = 'no_state_files';
const STATE_QUESTION_ID = 'state_backend_responsibility';
const legacyStateValueMap: Record<string, string> = {
  yes: 'tool_managed',
  no: 'self_managed',
  unsure: 'unsure'
};

export const normalizeAnswers = (answers: AnswerMap): AnswerMap => {
  const next = { ...answers };

  if (LEGACY_STATE_QUESTION_ID in next) {
    if (!(STATE_QUESTION_ID in next)) {
      const legacyValue = next[LEGACY_STATE_QUESTION_ID];
      const mapped = legacyStateValueMap[legacyValue];
      if (mapped) {
        next[STATE_QUESTION_ID] = mapped;
      }
    }

    delete next[LEGACY_STATE_QUESTION_ID];
  }

  return next;
};

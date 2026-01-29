'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import tools from '../../data/tools.json';
import { normalizeAnswers } from '../../lib/answers';
import { recommend, type AnswerMap } from '../../lib/recommend';
import { groupResults } from '../../lib/groupResults';
import questions from '../../data/questions.json';

const ANSWER_KEY = 'whichiac:answers';

const getTool = (toolId: string) => tools.find((tool) => tool.id === toolId);

const collectAlignment = (answers: AnswerMap, tool: (typeof tools)[number]) => {
  const alignments: string[] = [];
  const mismatches: string[] = [];
  const pushUnique = (list: string[], item: string) => {
    if (!item || list.includes(item)) return;
    list.push(item);
  };
  const definition = tool.definitionModel.toLowerCase();
  const focus = tool.focus.toLowerCase();
  const targets = tool.primaryTargets.map((target) => target.toLowerCase());
  const stateModel = tool.stateModel.toLowerCase();

  if (answers.language_preference === 'general_purpose') {
    if (definition.includes('general-purpose')) {
      pushUnique(alignments, 'Code-first authoring');
    } else if (
      definition.includes('declarative') ||
      definition.includes('template') ||
      definition.includes('kubernetes custom resources')
    ) {
      pushUnique(mismatches, 'Declarative authoring');
    }
  }
  if (answers.language_preference === 'declarative') {
    if (
      definition.includes('declarative') ||
      definition.includes('template') ||
      definition.includes('kubernetes custom resources')
    ) {
      pushUnique(alignments, 'Declarative authoring');
    } else if (definition.includes('general-purpose')) {
      pushUnique(mismatches, 'Code-first authoring');
    }
  }

  if (answers.automation_focus === 'infra_provisioning') {
    if (focus === 'infrastructure provisioning') {
      pushUnique(alignments, 'Infra provisioning');
    } else {
      pushUnique(mismatches, `Different layer: ${tool.focus}`);
    }
  }
  if (answers.automation_focus === 'config_management') {
    if (focus === 'configuration management') {
      pushUnique(alignments, 'Config management');
    } else {
      pushUnique(mismatches, `Different layer: ${tool.focus}`);
    }
  }
  if (answers.automation_focus === 'control_plane') {
    if (focus.includes('control plane')) {
      pushUnique(alignments, 'Control-plane focus');
    } else {
      pushUnique(mismatches, `Different layer: ${tool.focus}`);
    }
  }

  if (answers.target_scope === 'aws_native') {
    if (targets.includes('aws')) {
      pushUnique(alignments, 'AWS-native');
    } else if (targets.includes('multi-cloud')) {
      pushUnique(mismatches, 'Not AWS-native (multi-cloud-first)');
    }
  }
  if (answers.target_scope === 'aws_only') {
    if (targets.includes('aws') || targets.includes('multi-cloud')) {
      pushUnique(alignments, 'Works with AWS');
    }
  }
  if (answers.target_scope === 'multi_cloud') {
    if (targets.includes('multi-cloud')) {
      pushUnique(alignments, 'Multi-cloud');
    } else if (targets.includes('aws')) {
      pushUnique(mismatches, 'AWS-first (not multi-cloud)');
    }
  }

  if (answers.state_backend_responsibility === 'tool_managed') {
    if (
      stateModel.includes('service-managed') ||
      stateModel.includes('cloudformation-managed')
    ) {
      pushUnique(alignments, 'State managed by the service');
    } else if (stateModel.includes('no separate state backend')) {
      pushUnique(alignments, 'No separate state file');
    } else if (stateModel.includes('pulumi state backend')) {
      pushUnique(alignments, 'Managed state service available');
    } else if (stateModel.includes('state backend (local or remote)')) {
      pushUnique(mismatches, 'State backend required');
    }
  }

  if (answers.control_plane_opt_in === 'no' && focus.includes('control plane')) {
    pushUnique(mismatches, 'Control-plane model');
  }

  if (answers.managed_state === 'yes') {
    if (stateModel.includes('pulumi state backend')) {
      pushUnique(alignments, 'Managed state service available');
    }
  }

  return { alignments, mismatches };
};

const groupDocs = (docs: { label: string; url: string }[]) => {
  const groups = {
    Docs: [] as { label: string; url: string }[],
    'CLI/Engine': [] as { label: string; url: string }[],
    Source: [] as { label: string; url: string }[]
  };

  for (const doc of docs) {
    const label = doc.label.toLowerCase();
    const url = doc.url.toLowerCase();
    if (url.includes('github.com') || label.includes('github')) {
      groups.Source.push(doc);
    } else if (label.includes('cli') || label.includes('guide')) {
      groups['CLI/Engine'].push(doc);
    } else {
      groups.Docs.push(doc);
    }
  }

  return Object.entries(groups)
    .map(([title, items]) => ({ title, items }))
    .filter((group) => group.items.length > 0);
};

const subscribeAnswers = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ANSWER_KEY) {
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('storage', onStorage);
  };
};

export default function ResultPage() {
  const stored = useSyncExternalStore(
    subscribeAnswers,
    () => localStorage.getItem(ANSWER_KEY),
    () => null
  );

  const answers = useMemo(() => {
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as AnswerMap;
      return normalizeAnswers(parsed);
    } catch {
      return null;
    }
  }, [stored]);

  const result = useMemo(() => {
    if (!answers) return null;
    return recommend(answers);
  }, [answers]);

  const groupedResults = useMemo(() => {
    if (!result || !answers) return null;
    return groupResults(result, answers);
  }, [result, answers]);

  if (!answers || !result) {
    return (
      <section className="results">
        <h1>No stored answers</h1>
        <p>Complete the questionnaire to generate a ranked list and explanations.</p>
        <Link className="primary" href="/quiz">
          Open questionnaire
        </Link>
      </section>
    );
  }

  return (
    <section className="results">
      <div className="results-header">
        <h1>Ranked results</h1>
        <p>
          Based on your answers, tools that violate constraints are removed, then the
          remaining set is ordered by weighted fit.
        </p>
        <p>This output is a decision aid, not a global ranking.</p>
        <div className="actions">
          <Link className="secondary" href="/compare/">
            View comparison table
          </Link>
        </div>
      </div>

      <div className="ranked">
        <p>
          Grouped by overall fit and trade-offs. Many teams use more than one tool.
        </p>
        {groupedResults?.map((group) => (
          <section key={group.id} className="rank-card">
            <h2>
              {group.title}
              <span className="score"> · {group.items.length} tools</span>
            </h2>
            {group.items.length === 0 ? (
              <p className="fit-meta">{group.emptyMessage}</p>
            ) : null}
            {group.items.length > 0 ? (
              <div className="fit-grid">
              <div className="fit-grid-row fit-grid-header">
                <div>Tool</div>
                <div>Match signals</div>
                <div>Conflicts</div>
                <div>Tool context</div>
                <div>References</div>
              </div>
              {group.items.map((item) => {
                const tool = getTool(item.toolId);
                const reasonText =
                  item.fitSignals.length > 0
                    ? item.fitSignals.map((rule) => rule.message).join(' ')
                    : 'No strong signals in your answers for this tool.';
                const conflictsText =
                  item.conflicts.length > 0
                    ? item.conflicts.map((rule) => rule.message).join(' ')
                    : '—';
                const alignment = tool ? collectAlignment(answers, tool) : null;
                const alignText = alignment?.alignments.slice(0, 3).join(', ');
                const mismatchText = alignment?.mismatches.slice(0, 2).join(', ');
                const factsText = tool
                  ? `Focus: ${tool.focus}. Definition model: ${tool.definitionModel}. State model: ${tool.stateModel}. Targets: ${tool.primaryTargets.join(
                      ', '
                    )}.`
                  : '';
                const chefDeclarativeNote =
                  tool?.id === 'chef' && answers.language_preference === 'declarative'
                    ? 'Uses a Ruby-based DSL rather than YAML-style declarative configuration.'
                    : null;
                const groupedDocs = tool?.officialDocs?.length
                  ? groupDocs(tool.officialDocs)
                  : [];

                return (
                  <div key={item.toolId} className="fit-grid-row">
                    <div data-label="Tool">
                      <Link href={`/tools/${item.toolId}/`}>
                        {tool?.name ?? item.toolId}
                      </Link>
                    </div>
                    <div data-label="Match signals">{reasonText}</div>
                    <div data-label="Conflicts">{conflictsText}</div>
                    <div data-label="Tool context">
                      <div>{factsText}</div>
                      {chefDeclarativeNote ? (
                        <div className="fit-meta">{chefDeclarativeNote}</div>
                      ) : null}
                      {alignText ? (
                        <div className="fit-meta">Alignment: {alignText}.</div>
                      ) : null}
                      {mismatchText ? (
                        <div className="fit-meta">Not a match: {mismatchText}.</div>
                      ) : null}
                    </div>
                    <div data-label="References">
                      {tool?.officialDocs?.length ? (
                        <details>
                          <summary>Official references</summary>
                          {groupedDocs.map((group) => (
                            <div key={group.title} className="fit-meta">
                              <div className="fit-meta-title">{group.title}</div>
                              <ul>
                                {group.items.map((doc) => (
                                  <li key={doc.url}>
                                    <a href={doc.url} target="_blank" rel="noreferrer">
                                      {doc.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </details>
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            ) : null}
          </section>
        ))}
      </div>

      <section className="answer-recap">
        <h2>Your inputs</h2>
        <div className="recap-grid">
          {questions.map((question) => {
            const selected = answers[question.id];
            const label =
              question.options.find((option) => option.value === selected)?.label ??
              'Not answered';
            return (
              <div key={question.id} className="recap-card">
                <div className="recap-question">{question.prompt}</div>
                <div className="recap-answer">{label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="excluded">
        <h2>Excluded tools</h2>
        {result.excluded.length === 0 ? (
          <p>No tools were excluded by hard constraints.</p>
        ) : (
          <div className="excluded-grid">
            {result.excluded.map((item) => {
              const tool = getTool(item.toolId);
              const primaryDoc = tool?.officialDocs?.[0];
              return (
                <article key={item.toolId} className="excluded-card">
                  <h3 className="excluded-title">
                    {primaryDoc ? (
                      <a href={primaryDoc.url} target="_blank" rel="noreferrer">
                        {tool?.name ?? item.toolId}
                      </a>
                    ) : (
                      tool?.name ?? item.toolId
                    )}
                  </h3>
                  <ul className="excluded-reasons">
                    {item.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

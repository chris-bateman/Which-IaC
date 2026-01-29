'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import tools from '../../data/tools.json';
import { normalizeAnswers } from '../../lib/answers';
import { recommend, type AnswerMap } from '../../lib/recommend';
import questions from '../../data/questions.json';

const ANSWER_KEY = 'whichiac:answers';

const getTool = (toolId: string) => tools.find((tool) => tool.id === toolId);

export default function ResultPage() {
  const stored = useSyncExternalStore(
    () => () => {},
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
        {result.ranked.map((item, index) => {
          const tool = getTool(item.toolId);
          const reasons = item.firedRules.map((rule) => rule.message);
          const reasonText =
            reasons.length > 0
              ? reasons.join(' ')
              : 'No strong signals in your answers for this tool.';
          const factsText = tool
            ? `Focus: ${tool.focus}. Definition model: ${tool.definitionModel}. State model: ${tool.stateModel}. Targets: ${tool.primaryTargets.join(
                ', '
              )}.`
            : '';

          return (
            <article key={item.toolId} className="rank-card">
              <header>
                <div className="rank">#{index + 1}</div>
                <div>
                  <h2>
                    <Link href={`/tools/${item.toolId}/`}>
                      {tool?.name ?? item.toolId}
                    </Link>
                  </h2>
                </div>
              </header>

              <div className="fit-box">
                <div>
                  <h3>Fit signals</h3>
                  <p>{reasonText}</p>
                </div>
                <div>
                  <h3>Tool context</h3>
                  <p>{factsText}</p>
                </div>
              </div>

              {tool?.officialDocs?.length ? (
                <div className="tool-links">
                  <div className="tool-links-title">Official references</div>
                  <ul>
                    {tool.officialDocs.map((doc) => (
                      <li key={doc.url}>
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          {doc.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

            </article>
          );
        })}
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

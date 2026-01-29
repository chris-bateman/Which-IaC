import Link from 'next/link';
import { tools, questions, rules } from '../../data';

export default function AboutPage() {
  return (
    <section className="about">
      <div className="about-header">
        <h1>How this works</h1>
        <p>
          This page documents the data, questions, and rules used by the decision model.
          It is a reference, not a global ranking.
        </p>
        <p>
          For data and contribution details, see the{' '}
          <a href="https://github.com/chris-bateman/Which-IaC/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
            contributing guide
          </a>
          .
        </p>
      </div>

      <section id="tools" className="about-section">
        <header>
          <h2>Tools ({tools.length})</h2>
          <p>Inspect the comparison table with source references.</p>
        </header>
        <div className="about-callout">
          <p>
            Review tool facts side by side, including focus area, definition model, supported
            languages, and state model.
          </p>
          <Link className="primary" href="/compare/">
            Open comparison table
          </Link>
        </div>
      </section>

      <section id="questions" className="about-section">
        <header>
          <h2>Questions ({questions.length})</h2>
          <p>The questionnaire uses these prompts and options.</p>
        </header>
        <div className="about-stack">
          {questions.map((question, index) => (
            <article key={question.id} className="about-card">
              <div className="about-card-header">
                <span className="about-step">Q{index + 1}</span>
                <h3>{question.prompt}</h3>
              </div>
              {question.helpText ? <p className="about-summary">{question.helpText}</p> : null}
              <div className="about-chips">
                {question.options.map((option) => (
                  <span key={option.value} className="about-chip">
                    {option.label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="rules" className="about-section">
        <header>
          <h2>Rules ({rules.mustHave.length + rules.weights.length})</h2>
          <p>Rules exclude tools that violate constraints, then apply weights to rank the rest.</p>
        </header>
        <div className="rules-layout">
          <section className="rules-card">
            <header>
              <h3>Hard constraints</h3>
              <p>These rules remove tools that fail a required condition.</p>
            </header>
            <div className="rules-list">
              {rules.mustHave.map((rule) => (
                <div key={rule.id} className="rules-item">
                  <div className="rules-badge">Must-have</div>
                  <div>
                    <div className="rules-title">{rule.id}</div>
                    <div className="rules-text">{rule.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rules-card">
            <header>
              <h3>Preference weights</h3>
              <p>These rules add weight based on selected preferences.</p>
            </header>
            <div className="rules-list">
              {rules.weights.map((rule) => (
                <div key={rule.id} className="rules-item">
                  <div className="rules-badge">Weight</div>
                  <div>
                    <div className="rules-title">{rule.id}</div>
                    <div className="rules-text">{rule.message}</div>
                    <div className="rules-weights">
                      {Object.entries(rule.weights)
                        .filter(([, value]) => value > 0)
                        .map(([toolId, value]) => (
                          <div key={toolId}>
                            {toolId}: +{value}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}

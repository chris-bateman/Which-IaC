import Link from 'next/link';
import tools from '../../data/tools.json';
import questions from '../../data/questions.json';
import rules from '../../data/rules.json';

export default function AboutPage() {
  return (
    <section className="about">
      <div className="about-header">
        <h1>How this works</h1>
        <p>
          This site uses tool facts, a short questionnaire, and transparent rules to help
          compare options. Everything below is drawn from the JSON data files.
        </p>
        <p>
          Want the details? See the{' '}
          <a href="https://github.com/chris-bateman/Which-IaC/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
            contributing guide
          </a>
          .
        </p>
      </div>

      <section id="tools" className="about-section">
        <header>
          <h2>Tools ({tools.length})</h2>
          <p>Browse the full comparison table with official references.</p>
        </header>
        <div className="about-callout">
          <p>
            See all tools side by side, including focus area, definition model, supported
            languages, and state model.
          </p>
          <Link className="primary" href="/compare/">
            Go to compare table
          </Link>
        </div>
      </section>

      <section id="questions" className="about-section">
        <header>
          <h2>Questions ({questions.length})</h2>
          <p>The quiz uses these prompts and options.</p>
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
          <p>Rules first exclude tools, then apply weights to rank the rest.</p>
        </header>
        <div className="rules-layout">
          <section className="rules-card">
            <header>
              <h3>Must-have exclusions</h3>
              <p>These rules remove tools that don’t meet a required condition.</p>
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
              <h3>Weighted preferences</h3>
              <p>These rules add weight based on your preferences.</p>
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

import Link from 'next/link';
import tools from '../data/tools.json';
import questions from '../data/questions.json';
import rules from '../data/rules.json';

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Find the tool that suits your needs.</h1>
        <p>
          Compare tools for infrastructure, configuration, and platform automation using
          official documentation and clear rules.
        </p>
        <div className="actions">
          <Link className="primary" href="/quiz/">
            Start quiz
          </Link>
          <Link className="secondary" href="/compare/">
            Compare tools
          </Link>
        </div>
      </div>
        <div className="hero-card" aria-hidden="true">
          <div className="hero-metric">
            <div className="label">Tools</div>
            <div className="value">{tools.length}</div>
          </div>
          <div className="hero-metric">
            <div className="label">Questions</div>
            <div className="value">{questions.length}</div>
          </div>
          <div className="hero-metric">
            <div className="label">Rules</div>
            <div className="value">{rules.mustHave.length + rules.weights.length}</div>
          </div>
        </div>
    </section>
  );
}

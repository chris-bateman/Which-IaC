import Link from 'next/link';
import { tools, questions, rules } from '../data';

export default function HomePage() {
  return (
    <section className="home">
      <div className="hero">
        <div className="hero-text">
          <h1>A structured way to evaluate IaC tools</h1>
          <p>
            Uses documented facts and a rules-based questionnaire to compare infrastructure,
            configuration, and orchestration tools.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary" href="/quiz/">
            Answer the questionnaire
          </Link>
          <Link className="secondary desktop-only" href="/compare/">
            View the comparison table
          </Link>
        </div>
          <p className="hero-note">
            {questions.length} questions, about 2-3 minutes, with results you can inspect.
          </p>
        <div className="hero-card">
          <Link className="hero-metric" href="/compare/">
            <div className="label">Tools</div>
            <div className="value">{tools.length}</div>
            <span className="metric-link">Review list</span>
          </Link>
          <Link className="hero-metric" href="/about/#questions">
            <div className="label">Questions</div>
            <div className="value">{questions.length}</div>
            <span className="metric-link">Review prompts</span>
          </Link>
          <Link className="hero-metric" href="/about/#rules">
            <div className="label">Rules</div>
            <div className="value">{rules.mustHave.length + rules.weights.length}</div>
            <span className="metric-link">Inspect scoring</span>
          </Link>
        </div>
        <div className="hero-secondary mobile-only">
          <Link className="secondary" href="/compare/">
            View the comparison table
          </Link>
        </div>
      </div>

      <div className="home-blocks">
        <div className="home-card">
          <h2>What this does</h2>
          <ul>
            <li>Shows how different tools define, deploy, and keep track of infrastructure.</li>
            <li>Narrows the field using explicit constraints and weighted preferences.</li>
            <li>Explains which rules were applied and how each result was derived.</li>
          </ul>
        </div>
        <div className="home-card">
          <h2>What this does not do</h2>
          <ul>
            <li>It is not a global ranking or a substitute for due diligence.</li>
            <li>It does not assess maturity, cost, or organisation-specific requirements.</li>
            <li>It does not recommend specific deployment choices.</li>
          </ul>
        </div>
        <div className="home-card">
          <h2>Methodology</h2>
          <p>The goal is transparency, not persuasion.</p>
          <ul>
            <li>Tool facts are sourced from official documentation where available.</li>
            <li>Scoring rules are public and can be inspected.</li>
          </ul>
          <a
            className="text-link"
            href="https://github.com/chris-bateman/Which-IaC"
            target="_blank"
            rel="noreferrer"
          >
            View source and scoring rules
          </a>
        </div>
      </div>
    </section>
  );
}

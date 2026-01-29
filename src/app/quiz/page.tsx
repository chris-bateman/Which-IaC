'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import questions from '../../data/questions.json';

const ANSWER_KEY = 'whichiac:answers';

export default function QuizPage() {
  const router = useRouter();
  const items = useMemo(() => questions, []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = items[step];
  const total = items.length;
  const selected = answers[current.id] ?? '';

  const onChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const onNext = () => {
    if (!selected) return;
    if (step < total - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    localStorage.setItem(ANSWER_KEY, JSON.stringify(answers));
    router.push('/result');
  };

  const onBack = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };

  return (
    <section className="quiz">
      <div className="quiz-header">
        <h1>IaC tooling questionnaire</h1>
        <p>
          {total} questions, typically 2-3 minutes, with explainable results.
        </p>
        <p>
          This is a questionnaire-based decision aid, not a global ranking.
        </p>
      </div>

      <div className="quiz-card" aria-live="polite">
        <div className="progress">
          Question {step + 1} of {total}
        </div>
        <h2>{current.prompt}</h2>
        {current.helpText && <p className="help">{current.helpText}</p>}

        <fieldset className="choices">
          <legend className="sr-only">{current.prompt}</legend>
          {current.options.map((option) => (
            <label key={option.value} className="choice">
              <input
                type="radio"
                name={current.id}
                value={option.value}
                checked={selected === option.value}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="quiz-actions">
          <button type="button" className="ghost" onClick={onBack} disabled={step === 0}>
            Back
          </button>
          <button type="button" className="primary" onClick={onNext} disabled={!selected}>
            {step === total - 1 ? 'View results' : 'Next'}
          </button>
        </div>
      </div>
    </section>
  );
}

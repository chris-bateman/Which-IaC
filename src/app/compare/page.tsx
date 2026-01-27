 'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import tools from '../../data/tools.json';

type SortKey =
  | 'name'
  | 'focus'
  | 'definitionModel'
  | 'primaryTargets'
  | 'supportedLanguages'
  | 'stateModel';

type SortState = { key: SortKey; direction: 'asc' | 'desc' };

export default function ComparePage() {
  const [sort, setSort] = useState<SortState>({
    key: 'name',
    direction: 'asc'
  });

  const sortedTools = useMemo(() => {
    const list = [...tools];
    list.sort((a, b) => {
      const valueA =
        sort.key === 'primaryTargets'
          ? a.primaryTargets.join(', ')
          : sort.key === 'supportedLanguages'
            ? a.supportedLanguages.join(', ')
            : String(a[sort.key]);
      const valueB =
        sort.key === 'primaryTargets'
          ? b.primaryTargets.join(', ')
          : sort.key === 'supportedLanguages'
            ? b.supportedLanguages.join(', ')
            : String(b[sort.key]);
      const comparison = valueA.localeCompare(valueB);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  const sortLabel = (key: SortKey) => {
    if (sort.key !== key) return 'Not sorted';
    return sort.direction === 'asc' ? 'Sorted ascending' : 'Sorted descending';
  };

  return (
    <section className="compare">
      <div className="compare-header">
        <h1>Compare tools</h1>
        <p>Side-by-side facts pulled from official documentation.</p>
      </div>

      <div className="table-wrapper" role="region" aria-label="IaC tools comparison">
        <table>
          <thead>
            <tr>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('name')}
                  aria-label={`Sort by tool name. ${sortLabel('name')}`}
                >
                  Tool
                  <span className="sort-indicator">
                    {sort.key === 'name' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('focus')}
                  aria-label={`Sort by focus. ${sortLabel('focus')}`}
                >
                  Focus
                  <span className="sort-indicator">
                    {sort.key === 'focus' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('definitionModel')}
                  aria-label={`Sort by definition model. ${sortLabel('definitionModel')}`}
                >
                  Definition model
                  <span className="sort-indicator">
                    {sort.key === 'definitionModel'
                      ? sort.direction === 'asc'
                        ? '↑'
                        : '↓'
                      : ''}
                  </span>
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('primaryTargets')}
                  aria-label={`Sort by primary targets. ${sortLabel('primaryTargets')}`}
                >
                  Primary targets
                  <span className="sort-indicator">
                    {sort.key === 'primaryTargets'
                      ? sort.direction === 'asc'
                        ? '↑'
                        : '↓'
                      : ''}
                  </span>
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('supportedLanguages')}
                  aria-label={`Sort by supported languages. ${sortLabel('supportedLanguages')}`}
                >
                  Supported languages
                  <span className="sort-indicator">
                    {sort.key === 'supportedLanguages'
                      ? sort.direction === 'asc'
                        ? '↑'
                        : '↓'
                      : ''}
                  </span>
                </button>
              </th>
              <th scope="col">
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => toggleSort('stateModel')}
                  aria-label={`Sort by state model. ${sortLabel('stateModel')}`}
                >
                  State model
                  <span className="sort-indicator">
                    {sort.key === 'stateModel' ? (sort.direction === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTools.map((tool) => (
              <tr key={tool.id}>
                <th scope="row">
                  <Link href={`/tools/${tool.id}/`}>{tool.name}</Link>
                </th>
                <td>{tool.focus}</td>
                <td>{tool.definitionModel}</td>
                <td>{tool.primaryTargets.join(', ')}</td>
                <td>{tool.supportedLanguages.join(', ')}</td>
                <td>{tool.stateModel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

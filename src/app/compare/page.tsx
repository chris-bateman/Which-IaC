import Link from 'next/link';
import tools from '../../data/tools.json';

export default function ComparePage() {
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
              <th scope="col">Tool</th>
              <th scope="col">Focus</th>
              <th scope="col">Definition model</th>
              <th scope="col">Primary targets</th>
              <th scope="col">Supported languages</th>
              <th scope="col">State model</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
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

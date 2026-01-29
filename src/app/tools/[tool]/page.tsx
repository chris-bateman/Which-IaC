import { notFound } from 'next/navigation';
import { getToolById, tools } from '../../../data';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.id }));
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) return notFound();

  return (
    <section className="tool-page">
      <header>
        <h1>{tool.name}</h1>
        <p>{tool.summary}</p>
        <p>This page is a reference entry, not a ranking.</p>
      </header>

      <div className="tool-grid">
        <div className="tool-card">
          <h2>Core facts</h2>
          <dl>
            <div>
              <dt>Definition model</dt>
              <dd>{tool.definitionModel}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{tool.focus}</dd>
            </div>
            <div>
              <dt>Primary targets</dt>
              <dd>{tool.primaryTargets.join(', ')}</dd>
            </div>
            <div>
              <dt>Supported languages</dt>
              <dd>{tool.supportedLanguages.join(', ')}</dd>
            </div>
            <div>
              <dt>State model</dt>
              <dd>{tool.stateModel}</dd>
            </div>
            <div>
              <dt>Execution model</dt>
              <dd>{tool.executionModel}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>{tool.license}</dd>
            </div>
          </dl>
        </div>

        <div className="tool-card">
          <h2>Official references</h2>
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
      </div>
    </section>
  );
}

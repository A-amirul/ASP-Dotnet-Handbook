import { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '../lib/utils';
import type { Diagram, LocalizedText } from '../data/types';
import { LocalizedLabel, LocalizedSplit } from './LocalizedSplit';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, Hind Siliguri, Noto Sans Bengali, sans-serif',
});

type DiagramBlockProps = {
  diagram: Diagram;
  className?: string;
};

function Caption({ caption }: { caption?: LocalizedText }) {
  if (!caption?.en && !caption?.bn) return null;
  return (
    <figcaption className="mt-3 text-sm text-slate-600">
      <LocalizedSplit
        columns="side"
        en={caption.en ? <p lang="en">{caption.en}</p> : undefined}
        bn={
          caption.bn ? (
            <p lang="bn" className="font-bengali text-indigo-800">
              {caption.bn}
            </p>
          ) : undefined
        }
      />
    </figcaption>
  );
}

export function DiagramBlock({ diagram, className }: DiagramBlockProps) {
  const id = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (diagram.type === 'ascii') {
        setSvg('');
        setError(false);
        return;
      }

      try {
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, diagram.content);
        if (!cancelled) {
          setSvg(rendered);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [diagram.content, diagram.type, id]);

  const title = diagram.title;

  return (
    <figure className={cn('w-full', className)}>
      {(title?.en || title?.bn) && (
        <div className="mb-3">
          <LocalizedLabel
            en={title.en ?? ''}
            bn={title.bn ?? ''}
            className="text-handbook-h4 text-slate-800"
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 md:p-6 diagram-block"
      >
        {diagram.type === 'ascii' || error ? (
          <pre className="text-sm font-mono text-slate-700 leading-relaxed whitespace-pre-wrap m-0">
            {diagram.content}
          </pre>
        ) : (
          <div
            className="flex justify-center min-w-0 [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>

      <Caption caption={diagram.caption} />
    </figure>
  );
}

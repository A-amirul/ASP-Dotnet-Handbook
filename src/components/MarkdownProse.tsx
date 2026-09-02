import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';

type MarkdownProseProps = {
  content: string;
  className?: string;
  lang?: 'en' | 'bn';
};

export function MarkdownProse({ content, className, lang }: MarkdownProseProps) {
  if (!content?.trim()) return null;

  return (
    <div
      lang={lang}
      className={cn(
        'handbook-prose max-w-none',
        lang === 'bn' && 'font-bengali leading-8',
        className
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto w-full pb-2 mb-4 custom-scrollbar">
              <table className="w-full min-w-[480px]" {...props} />
            </div>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

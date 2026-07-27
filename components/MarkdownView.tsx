import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/markdown";

export default function MarkdownView({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className="prose-rebel space-y-5 leading-[var(--reader-leading,1.8)]"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h2: ({ children }) => <h2 id={slugify(String(children))} className="pt-8 text-3xl uppercase">{children}</h2>,
        h3: ({ children }) => <h3 id={slugify(String(children))} className="pt-5 text-2xl uppercase">{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

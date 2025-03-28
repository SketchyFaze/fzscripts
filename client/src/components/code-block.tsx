import { useState, useEffect } from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export default function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  // Simple syntax highlighting function
  const highlightCode = (code: string, language: string) => {
    // Define regex patterns for different syntax elements
    const patterns = {
      keyword: /\b(function|return|if|else|for|while|let|const|var|new|this|class|extends|import|export|from|try|catch|throw|async|await)\b/g,
      string: /(["'`])(\\?.)*?\1/g,
      number: /\b\d+\b/g,
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      function: /\b([a-zA-Z_$][\w$]*)\s*\(/g,
      decorator: /@\w+/g,
      boolean: /\b(true|false|null|undefined)\b/g,
    };
    
    // Replace code with highlighted spans
    let highlightedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Apply patterns
    highlightedCode = highlightedCode
      .replace(patterns.comment, '<span class="text-gray-500">$&</span>')
      .replace(patterns.keyword, '<span class="text-purple-500">$&</span>')
      .replace(patterns.string, '<span class="text-green-500">$&</span>')
      .replace(patterns.number, '<span class="text-amber-500">$&</span>')
      .replace(patterns.function, '<span class="text-blue-500">$1</span>(')
      .replace(patterns.decorator, '<span class="text-pink-500">$&</span>')
      .replace(patterns.boolean, '<span class="text-amber-500">$&</span>');
    
    return { __html: highlightedCode };
  };
  
  return (
    <div className={cn("rounded-md overflow-hidden font-mono relative", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-card/50 border-b border-border">
        <span className="text-xs text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground focus:outline-none"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <ClipboardCopy className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="p-4 bg-background/50 overflow-x-auto">
        <pre className="text-sm">
          <code dangerouslySetInnerHTML={highlightCode(code, language)} />
        </pre>
      </div>
    </div>
  );
}

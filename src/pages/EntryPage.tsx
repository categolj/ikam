import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql-client';
import { GET_ENTRY } from '../lib/queries';
import { GetEntryResponse } from '../lib/types';
import { insertToc, generateSlug } from '../lib/toc-generator';
import { CalendarDays, User, Clock, ArrowLeft, Share2, FileDown, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import BackToTop from '../components/BackToTop';
import { Badge } from '../components/ui/badge';
import CategoryList from '../components/CategoryList';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
// Import a subset of languages that we want to support
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import sql from 'highlight.js/lib/languages/sql';
import markdown from 'highlight.js/lib/languages/markdown';

// Define the supported languages and register them with lowlight
const supportedLanguages = {
  'js': javascript,
  'javascript': javascript,
  'ts': typescript,
  'typescript': typescript,
  'bash': bash,
  'sh': bash,
  'css': css,
  'json': json,
  'java': java,
  'py': python,
  'python': python,
  'xml': xml,
  'html': xml,
  'yaml': yaml,
  'yml': yaml,
  'sql': sql,
  'md': markdown,
  'markdown': markdown,
};

interface CodeBlockProps {
  node?: React.ReactNode;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown; // For any other props
}

const CodeBlock = ({inline, className, children, ...props}: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = React.useRef<HTMLElement>(null);
  // Removed unused match variable
  
  // Function to handle copying code to clipboard
  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || '';
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
        });
    }
  };

  // If it's inline code, just return it without copy button
  if (inline) {
    // Add font-size-smaller class to inline code as well
    return <code className={`${className || ''} inline-code`} {...props}>{children}</code>;
  }

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2">
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted rounded"
          title={isCopied ? "Copied!" : "Copy code"}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className={className} {...props}>
        <code ref={codeRef} className="font-size-smaller">
          {children}
        </code>
      </pre>
    </div>
  );
};

// TocContainer component to handle the TOC functionality
const TocContainer = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
  const tocRef = React.useRef<HTMLDivElement>(null);
  
  // Effect to add toggle functionality
  React.useEffect(() => {
    const tocElement = tocRef.current;
    if (!tocElement) return;

    // Function to toggle the TOC visibility
    const toggleToc = () => {
      tocElement.classList.toggle('collapsed');
      
      // Store the state in localStorage for persistence
      const isCollapsed = tocElement.classList.contains('collapsed');
      localStorage.setItem('tocCollapsed', isCollapsed ? 'true' : 'false');
    };

    // Add click event listener
    const handleClick = (e: MouseEvent) => {
      // Only handle clicks on the TOC title (::before pseudo-element)
      const rect = tocElement.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      
      // If click is in the title area (approx. first 40px)
      if (clickY < 40) {
        toggleToc();
      }
    };
    
    tocElement.addEventListener('click', handleClick);

    // Check localStorage for preferred state
    const savedState = localStorage.getItem('tocCollapsed');
    if (savedState === 'true') {
      tocElement.classList.add('collapsed');
    }

    // Cleanup
    return () => {
      tocElement.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div ref={tocRef} className="toc-container" {...props}>
      {children}
    </div>
  );
};

const EntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuery<GetEntryResponse>(
    ['entry', entryId],
    async () => {
      return await graphqlClient.request(GET_ENTRY, { entryId });
    },
    {
      enabled: !!entryId,
    }
  );

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    return readingTime;
  };

  // Go back to previous page
  const goBack = () => {
    navigate(-1);
  };

  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.getEntry.frontMatter.title,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying to clipboard', error));
    }
  };
  
  // Handle PDF generation
  const handleGeneratePDF = () => {
    // Open print dialog with PDF options pre-selected
    window.print();
  };

  if (isLoading) {
    return (
      <div className="my-6 space-y-4 animate-pulse px-2 sm:px-4">
        <div className="h-6 w-3/4 bg-muted/50 rounded-md"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted/50 rounded-md"></div>
          <div className="h-3 w-full bg-muted/50 rounded-md"></div>
          <div className="h-3 w-2/3 bg-muted/50 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-8 px-2 sm:px-4">
        <h2 className="text-lg font-bold mb-2">Article Not Found</h2>
        <p className="text-muted-foreground text-sm mb-4">
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={goBack} size="sm" className="text-xs h-7">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Go Back
        </Button>
      </div>
    );
  }

  const { frontMatter, content: rawContent, created, updated } = data.getEntry;
  const { title, categories, tags } = frontMatter;
  
  // Process content to replace <!-- toc --> with table of contents
  const content = insertToc(rawContent);
  
  const readingTime = calculateReadingTime(content);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 hover:bg-transparent hover:text-primary text-xs h-7"
        onClick={goBack}
      >
        <ChevronLeft className="mr-1 h-3 w-3" />
        Back
      </Button>

      {/* Article Header */}
      <header className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold mb-3">{title}</h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{created.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-3 w-3" />
            <span>Created: {formatDate(created.date)}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-3 w-3" />
            <span>Updated: {formatDate(updated.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Categories as hierarchical breadcrumb */}
        <CategoryList categories={categories} className="mb-3 text-xs" separator={true} />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 flex items-center"
            onClick={handleShare}
          >
            <Share2 className="mr-1 h-3 w-3" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 flex items-center"
            onClick={handleGeneratePDF}
          >
            <FileDown className="mr-1 h-3 w-3" />
            PDF
          </Button>
        </div>
      </header>

      {/* Article Content */}
      <article data-title={title} className="prose prose-sm prose-invert max-w-none mb-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw, 
            [rehypeHighlight, { ignoreMissing: true, languages: supportedLanguages }]
          ]}
          className="markdown-body"
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: CodeBlock as any,
            blockquote: ({ children, ...props }) => (
              <blockquote style={{ fontStyle: 'normal' }} {...props}>
                {children}
              </blockquote>
            ),
            div: ({ className, children, ...props }) => {
              // Check if this is the TOC container
              if (className?.includes('toc-container')) {
                return <TocContainer {...props}>{children}</TocContainer>;
              }
              // Regular div
              return <div {...props}>{children}</div>;
            },
            // Add IDs to headings for anchor links
            h1: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h1 id={slug} {...props}>{children}</h1>;
            },
            h2: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h2 id={slug} {...props}>{children}</h2>;
            },
            h3: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h3 id={slug} {...props}>{children}</h3>;
            },
            h4: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h4 id={slug} {...props}>{children}</h4>;
            },
            h5: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h5 id={slug} {...props}>{children}</h5>;
            },
            h6: ({ children, ...props }) => {
              const text = String(children);
              const slug = generateSlug(text);
              return <h6 id={slug} {...props}>{children}</h6>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Article Footer */}
      <footer className="border-t border-border pt-4 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Last updated: {formatDate(updated.date)}
            </p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Link to={`/?tag=${tag.name}`} key={tag.name}>
                  <Badge variant="outline" className="text-xs py-0">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-1 mt-2 md:mt-0">
            <Button variant="ghost" size="sm" className="text-xs h-7 flex items-center">
              <ChevronLeft className="mr-1 h-3 w-3" />
              Previous
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7 flex items-center">
              Next
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default EntryPage;
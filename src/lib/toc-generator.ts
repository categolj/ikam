/**
 * Table of Contents Generator Utility
 * 
 * This utility parses markdown content and generates a table of contents (TOC)
 * based on heading elements. It can replace a `<!-- toc -->` placeholder with
 * an actual TOC.
 */

// Regular expression for matching headings (# to ######)
const HEADING_REGEX = /^(#{1,6})\s+(.+)$/gm;

// Heading level constants (not currently used but kept for future enhancements)
// const MIN_HEADING_LEVEL = 1;  // h1
// const MAX_HEADING_LEVEL = 6;  // h6

interface TocItem {
  level: number;
  text: string;
  slug: string;
  children: TocItem[];
}

/**
 * Generates a slug from text by converting to lowercase,
 * replacing spaces with hyphens, and considering CJK characters
 */
export function generateSlug(text: string): string {
  // Handle CJK (Chinese, Japanese, Korean) characters differently
  if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text)) {
    // For CJK content, create a more browser-friendly ID
    return text
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/[^\w\u3000-\u9fff-]/g, '')  // Keep CJK chars and alphanumeric
      .replace(/-+/g, '-')      // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
  }
  
  // For Latin and other scripts, use the standard approach
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // Remove non-word chars (except hyphens and spaces)
    .replace(/[\s_]+/g, '-')    // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');   // Trim hyphens from start and end
}

/**
 * Extracts headings from markdown content
 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  let match;

  // Remove the TOC placeholder before parsing headings to avoid picking up any headings in the placeholder
  const cleanMarkdown = markdown.replace('<!-- toc -->', '');

  // Reset regex lastIndex
  HEADING_REGEX.lastIndex = 0;
  
  while ((match = HEADING_REGEX.exec(cleanMarkdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = generateSlug(text);
    
    // Only include H2-H6 headings in the TOC (skip H1 which is usually the title)
    if (level > 1) {
      headings.push({
        level: level - 1, // Adjust level to start from 1 (for H2) for better nesting
        text,
        slug,
        children: []
      });
    }
  }

  return nestHeadings(headings);
}

/**
 * Nests headings in a hierarchical structure
 */
function nestHeadings(headings: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  headings.forEach(heading => {
    // Clear stack of any headings with greater or equal level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // This is a top-level heading
      root.push(heading);
    } else {
      // This is a child of the last item in the stack
      stack[stack.length - 1].children.push(heading);
    }

    // Push current heading onto stack
    stack.push(heading);
  });

  return root;
}

/**
 * Renders a table of contents as HTML based on the nested headings
 */
function renderTocMarkdown(headings: TocItem[], indent = 0): string {
  if (headings.length === 0) return '';

  let html = '';
  
  headings.forEach(heading => {
    // Generate HTML list item with link
    html += `<li><a href="#${heading.slug}">${heading.text}</a>`;
    
    // Render children as nested list if they exist
    if (heading.children.length > 0) {
      html += `\n<ul>\n${renderTocMarkdown(heading.children, indent + 1)}</ul>`;
    }
    
    html += '</li>\n';
  });

  return html;
}

/**
 * Generates TOC HTML from heading structure
 */
export function generateToc(headings: TocItem[]): string {
  return renderTocMarkdown(headings);
}

/**
 * Takes markdown content with a TOC placeholder and replaces it with a generated TOC
 * @param markdown The markdown content
 * @param tocTitle Optional title for the TOC container (default is determined by language)
 */
export function insertToc(markdown: string, tocTitle?: string): string {
  // Check if the markdown contains a TOC placeholder
  if (!markdown.includes('<!-- toc -->')) {
    return markdown;
  }

  // Remove common TOC headers that might be present before the placeholder
  // This finds lines containing "Table of Contents" or "目次" preceding the TOC placeholder
  // and removes them to avoid duplication with our styled TOC title
  let processedMarkdown = markdown;
  
  // Match both Markdown heading style (# Table of Contents) and bold style (**Table of Contents**)
  const mdHeadingPattern = /^(#{1,6})\s+(.*?(?:Table of Contents|目次).*?)(?:\r?\n|\r)(?:(?!\r?\n#{1,6}).)*?<!-- toc -->/ms;
  const boldPattern = /\*\*(Table of Contents|目次)\*\*\s*\r?\n\s*<!-- toc -->/g;
  
  processedMarkdown = processedMarkdown
    .replace(mdHeadingPattern, '<!-- toc -->')
    .replace(boldPattern, '<!-- toc -->');

  // Also remove any empty lines right before the TOC placeholder
  processedMarkdown = processedMarkdown.replace(/(\r?\n)+\s*<!-- toc -->/g, '\n<!-- toc -->');

  // Extract headings and generate TOC
  const headings = extractHeadings(processedMarkdown);
  const toc = generateToc(headings);
  
  // If no headings found, remove the TOC placeholder
  if (headings.length === 0) {
    return processedMarkdown.replace('<!-- toc -->', '');
  }

  // Determine TOC title based on language detection or provided title
  let autoTitle = 'Table of Contents';
  // Check if there's Japanese text in the document
  if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(processedMarkdown)) {
    autoTitle = '目次';
  }
  
  // Use provided title or fallback to auto-detected title
  const finalTitle = tocTitle || autoTitle;
  
  // Add the title as a data attribute (fallback in CSS)
  // We're using a text node as the first child rather than relying on CSS :before
  // This ensures better browser compatibility
  return processedMarkdown.replace('<!-- toc -->', `<div class="toc-container"><div class="toc-title">${finalTitle}</div><ul>\n${toc}</ul></div>`);
}
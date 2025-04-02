import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql-client';
import { GET_ENTRIES } from '../lib/queries';
import EntryCard from '../components/EntryCard';
import { GetEntriesResponse } from '../lib/types';
import BackToTop from '../components/BackToTop';
import FeaturedTags from '../components/FeaturedTags';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Loader2, ChevronDown, X, Search } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  const searchParam = searchParams.get('search');
  
  // Parse search keywords from URL parameter
  const parseSearchParam = (param: string | null): string[] => {
    if (!param) return [];
    
    const keywords: string[] = [];
    const currentInput = param.trim();
    
    // Regular expression to match quoted strings (both single and double quotes)
    const quoteRegex = /(["'])(.*?)\1/g;
    let match;
    let lastIndex = 0;
    
    // Extract quoted strings
    while ((match = quoteRegex.exec(currentInput)) !== null) {
      // Process text before the quoted string
      const textBefore = currentInput.substring(lastIndex, match.index).trim();
      if (textBefore) {
        // Split non-quoted text by whitespace
        keywords.push(...textBefore.split(/\s+/));
      }
      
      // Add the quoted string as a single keyword (without the quotes)
      keywords.push(match[2]);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Process any remaining text after the last quoted string
    const remainingText = currentInput.substring(lastIndex).trim();
    if (remainingText) {
      keywords.push(...remainingText.split(/\s+/));
    }
    
    // Filter out empty strings and return unique keywords
    return [...new Set(keywords.filter(keyword => keyword.length > 0))];
  };
  
  // Define state variables
  const [searchKeywords, setSearchKeywords] = useState<string[]>(parseSearchParam(searchParam));
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  
  // Initialize state from URL parameters when URL changes
  useEffect(() => {
    setActiveCategory(categoryParam);
    setActiveTag(tagParam);
    setSearchKeywords(parseSearchParam(searchParam));
  }, [location.search, categoryParam, tagParam, searchParam]);
  
  // Handle search input submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      // Parse input to handle quoted strings as single keywords
      const newKeywords: string[] = [];
      const currentInput = searchInputValue.trim();
      
      // Regular expression to match quoted strings (both single and double quotes)
      const quoteRegex = /(["'])(.*?)\1/g;
      let match;
      let lastIndex = 0;
      
      // Extract quoted strings
      while ((match = quoteRegex.exec(currentInput)) !== null) {
        // Process text before the quoted string
        const textBefore = currentInput.substring(lastIndex, match.index).trim();
        if (textBefore) {
          // Split non-quoted text by whitespace
          newKeywords.push(...textBefore.split(/\s+/));
        }
        
        // Add the quoted string as a single keyword (without the quotes)
        newKeywords.push(match[2]);
        
        lastIndex = match.index + match[0].length;
      }
      
      // Process any remaining text after the last quoted string
      const remainingText = currentInput.substring(lastIndex).trim();
      if (remainingText) {
        newKeywords.push(...remainingText.split(/\s+/));
      }
      
      // Filter out empty strings
      const filteredKeywords = newKeywords.filter(keyword => keyword.length > 0);
      
      // Create a new set of unique keywords that includes existing and new ones
      const uniqueKeywords = [...new Set([...searchKeywords, ...filteredKeywords])];
      
      // Update state - this will trigger the useEffect that updates the URL
      setSearchKeywords(uniqueKeywords);
      setSearchInputValue('');
    }
  };
  
  // Remove a specific keyword
  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = searchKeywords.filter(keyword => keyword !== keywordToRemove);
    setSearchKeywords(updatedKeywords);
    
    // Update URL parameters
    const params = new URLSearchParams(location.search);
    
    if (updatedKeywords.length === 0) {
      params.delete('search');
    } else {
      const searchString = updatedKeywords.map(keyword => {
        return keyword.includes(' ') ? `"${keyword}"` : keyword;
      }).join(' ');
      
      params.set('search', searchString);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };
  
  // Clear all search keywords
  const clearKeywords = () => {
    setSearchKeywords([]);
    setSearchInputValue('');
    
    // Update URL by removing search parameter but keeping other filters
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate({ search: params.toString() }, { replace: true });
  };

  // Update URL when filters or search keywords change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (activeTag) params.set('tag', activeTag);
    
    // Add search keywords to URL parameter
    if (searchKeywords.length > 0) {
      const searchString = searchKeywords.map(keyword => {
        // If keyword contains spaces, wrap it in double quotes
        return keyword.includes(' ') ? `"${keyword}"` : keyword;
      }).join(' ');
      
      params.set('search', searchString);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  }, [activeCategory, activeTag, searchKeywords, navigate]);

  // Fetch entries with pagination support
  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery<GetEntriesResponse>(
    ['entries', activeCategory, activeTag, searchKeywords], 
    async ({ pageParam = null }) => {
      const categories = activeCategory ? [activeCategory] : undefined;
      const tag = activeTag || undefined;
      
      // Reconstruct original query format with quotes
      let queryString = '';
      if (searchKeywords.length > 0) {
        queryString = searchKeywords.map(keyword => {
          // If keyword contains spaces, wrap it in double quotes
          return keyword.includes(' ') ? `"${keyword}"` : keyword;
        }).join(' ');
      }
      
      const query = queryString || undefined;
      
      return await graphqlClient.request(GET_ENTRIES, {
        first: 10,
        after: pageParam,
        categories,
        tag,
        query
      });
    },
    {
      getNextPageParam: (lastPage: GetEntriesResponse) => {
        return lastPage.getEntries.pageInfo.hasNextPage 
          ? lastPage.getEntries.pageInfo.endCursor 
          : undefined;
      },
      // Reset the query whenever search, categories, or tags change
      refetchOnWindowFocus: false,
    }
  );

  // Handle load more button click
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Clear all filters and search keywords
  const clearFilters = () => {
    setActiveCategory(null);
    setActiveTag(null);
    setSearchKeywords([]);
    setSearchInputValue('');
    
    // Clear URL parameters
    navigate({ search: '' }, { replace: true });
  };

  // Mobile filters toggle feature is removed - may be added back in future

  return (
    <div>
      {/* Main content with articles list */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-2 md:px-4">
          {/* Featured Tags Section */}
          <div className="mb-6">
            <FeaturedTags />
          </div>
          
          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className={`w-full py-2 px-4 pr-10 bg-muted/50 rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all ${
                  isSearchFocused ? 'border-primary ring-1 ring-primary' : ''
                }`}
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground bg-transparent border-none p-0 cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {searchKeywords.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <span className="text-xs text-muted-foreground">Searching for:</span>
                {searchKeywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs py-0 px-1 flex items-center gap-1"
                  >
                    {keyword}
                    <X 
                      size={10} 
                      className="cursor-pointer" 
                      onClick={(e) => {
                        e.preventDefault();
                        removeKeyword(keyword);
                      }} 
                    />
                  </Badge>
                ))}
                {searchKeywords.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 text-xs px-1 py-0"
                    onClick={clearKeywords}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}
          </form>
          
          {/* Active filters / breadcrumb */}
          <div className="mb-4 flex items-center text-xs">
            <span className="text-muted-foreground">Entries</span>
            {activeCategory && (
              <>
                <span className="mx-1 text-muted-foreground">/</span>
                <Badge variant="geekStyle" className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveCategory(null)}>
                  {activeCategory}
                  <X
                    size={10}
                    className="cursor-pointer"
                  />
                </Badge>
              </>
            )}
            {activeTag && (
              <>
                <span className="mx-1 text-muted-foreground">/</span>
                <Badge variant="geekStyle" className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTag(null)}>
                  {activeTag}
                  <X
                    size={10}
                    className="cursor-pointer"
                  />
                </Badge>
              </>
            )}
          </div>
          
          {isLoading ? (
            // Initial loading state
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-card border border-border rounded-lg h-16 animate-pulse"
                />
              ))}
            </div>
          ) : isError ? (
            // Error state
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Failed to load articles</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : data?.pages?.[0]?.getEntries.edges.length === 0 ? (
            // No results state
            <div className="text-center py-8 border border-border rounded-md bg-card/50">
              <p className="text-muted-foreground mb-4">No articles found matching the current filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            // Articles list with pagination
            <div className="space-y-2">
              {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.getEntries.edges.map(({ node }) => (
                    <EntryCard key={node.entryId} entry={node} />
                  ))}
                </React.Fragment>
              ))}
              
              {/* Load more button */}
              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleLoadMore} 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More <ChevronDown size={14} />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default HomePage;
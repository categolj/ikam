import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql-client';
import { GET_ENTRIES } from '../lib/queries';
import { GetEntriesResponse, Entry, EntryEdge } from '../lib/types';
import EntryCard from '../components/EntryCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Loader2, ChevronDown, Filter, X, Search, ArrowUp } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  
  // Handle search input submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
  };

  // Get category from URL params
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');

  // Set up state for filters
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  const [visibleFilters, setVisibleFilters] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (activeTag) params.set('tag', activeTag);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [activeCategory, activeTag, navigate]);

  // Fetch entries with pagination support
  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery(
    ['entries', activeCategory, activeTag, searchQuery], 
    async ({ pageParam = null }) => {
      const categories = activeCategory ? [activeCategory] : undefined;
      const tag = activeTag || undefined;
      const query = searchQuery.trim() || undefined;
      
      return await graphqlClient.request(GET_ENTRIES, {
        first: 10,
        after: pageParam,
        categories,
        tag,
        query
      });
    },
    {
      getNextPageParam: (lastPage) => {
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

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory(null);
    setActiveTag(null);
    setSearchQuery('');
    setSearchInputValue('');
    setVisibleFilters(false);
  };

  // Toggle mobile filters visibility
  const toggleFilters = () => {
    setVisibleFilters(!visibleFilters);
  };

  return (
    <div>
      {/* Main content with articles list */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-2 md:px-4">
          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
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
            {searchQuery && (
              <div className="mt-2 flex items-center">
                <span className="text-xs mr-1 text-muted-foreground">Searching for:</span>
                <Badge variant="outline" className="text-xs py-0 px-1 flex items-center gap-1">
                  {searchQuery}
                  <X 
                    size={10} 
                    className="cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery('');
                      setSearchInputValue('');
                    }} 
                  />
                </Badge>
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
      {showBackToTop && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={scrollToTop}
            size="sm"
            className="rounded-full w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary/90 shadow-md"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
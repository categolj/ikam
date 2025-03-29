import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../lib/graphql-client';
import { GET_ENTRIES } from '../lib/queries';
import { GetEntriesResponse, Entry } from '../lib/types';
import EntryCard from '../components/EntryCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ChevronRight, Terminal, Filter, X, Search } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // Fetch entries with filter
  const { data, isLoading, isError } = useQuery<GetEntriesResponse>(['entries', activeCategory, activeTag], async () => {
    const categories = activeCategory ? [activeCategory] : undefined;
    const tag = activeTag || undefined;
    
    return await graphqlClient.request(GET_ENTRIES, {
      first: 12,
      categories,
      tag
    });
  });

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory(null);
    setActiveTag(null);
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
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search articles..."
              className={`w-full py-2 px-4 pr-10 bg-muted/50 rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all ${
                isSearchFocused ? 'border-primary ring-1 ring-primary' : ''
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          
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
            // Loading state
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
          ) : data?.getEntries.edges.length === 0 ? (
            // No results state
            <div className="text-center py-8 border border-border rounded-md bg-card/50">
              <p className="text-muted-foreground mb-4">No articles found matching the current filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            // Articles list (vertical)
            <div className="space-y-2">
              {data?.getEntries.edges.map(({ node }) => (
                <EntryCard key={node.entryId} entry={node} />
              ))}
            </div>
          )}
          
          {/* Load more button */}
          {data?.getEntries.pageInfo.hasNextPage && (
            <div className="mt-6 text-center">
              <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
                Load More <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
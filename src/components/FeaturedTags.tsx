import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tag, X } from 'lucide-react';

// Default featured tags
const DEFAULT_FEATURED_TAGS = [
  'Spring Boot',
  'Spring AI',
  'Kubernetes',
  'Cloud Foundry',
  'Tanzu'
];

const FeaturedTags: React.FC = () => {
  const navigate = useNavigate();
  const [tags] = useState<string[]>(DEFAULT_FEATURED_TAGS);
  const [visible, setVisible] = useState<boolean>(true);

  // Handle click on a tag
  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  // Hide the section
  const handleHide = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Card className="bg-card/50 border-border hover:border-amber-500/50 dark:hover:border-yellow-400/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-600 dark:text-yellow-400" />
            <CardTitle className="text-base font-medium">Featured Tags</CardTitle>
          </div>
          <X 
            size={16}
            className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
            onClick={handleHide} 
            aria-label="Hide featured tags"
          />
        </div>
        <CardDescription className="text-xs">
          Trending topics in our tech ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="geekStyle"
              className="cursor-pointer hover:bg-amber-500/10 dark:hover:bg-yellow-400/10 transition-colors py-1"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedTags;

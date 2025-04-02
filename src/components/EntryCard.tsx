import { Link } from 'react-router-dom';
import { CalendarDays, User } from 'lucide-react';
import { Card, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Entry } from '../lib/types';

interface EntryCardProps {
  entry: Entry;
}

const EntryCard = ({ entry }: EntryCardProps) => {
  const { entryId, frontMatter, created, updated } = entry;
  const { title, categories } = frontMatter;

  // Format date to a more readable format
  const formattedCreatedDate = new Date(created.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedUpdatedDate = new Date(updated.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden hover:border-amber-500/50 dark:hover:border-yellow-400/50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center p-3">
        <div className="flex-grow pr-4">
          <CardTitle className="text-lg font-bold hover:text-amber-600 dark:hover:text-yellow-400 transition-colors mb-2">
            <Link to={`/entries/${entryId}`}>{title}</Link>
          </CardTitle>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {categories.map((category) => (
              <Badge key={category.name} variant="geekStyle" className="text-xs py-0">
                {category.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              <span>{created.name}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={12} className="mr-1" />
              <span>Created: {formattedCreatedDate}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={12} className="mr-1" />
              <span>Updated: {formattedUpdatedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-2 md:mt-0">
          <Button asChild variant="outline" size="sm" className="text-xs h-7 hover:bg-transparent hover:text-amber-600 dark:hover:text-yellow-400">
            <Link to={`/entries/${entryId}`}>
              Read →
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EntryCard;
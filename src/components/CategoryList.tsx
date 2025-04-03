import { Badge } from "./ui/badge";
import { Link } from 'react-router-dom';
import { Category } from '../lib/types';

interface CategoryListProps {
  categories: Category[];
  className?: string;
  separator?: boolean;
}

/**
 * A reusable component for rendering categories with hierarchical navigation.
 * Each category is clickable and filters entries based on its hierarchical position.
 * For example: if categories are ["Dev", "CaaS", "Kubernetes"],
 * clicking "Dev" filters by "Dev", 
 * clicking "CaaS" filters by "Dev,CaaS",
 * clicking "Kubernetes" filters by "Dev,CaaS,Kubernetes"
 */
const CategoryList = ({ categories, className = "", separator = false }: CategoryListProps) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {categories.map((category, index) => {
        // Build the hierarchical filter by taking all categories up to the current one
        const hierarchicalFilter = categories
          .slice(0, index + 1)
          .map(cat => cat.name)
          .join(',');
        
        return (
          <div key={category.name} className="flex items-center">
            {separator && index > 0 && (
              <span className="mx-1 text-muted-foreground">/</span>
            )}
            <Link to={`/?category=${hierarchicalFilter}`}>
              <Badge variant="geekStyle" className="text-xs py-0">
                {category.name}
              </Badge>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;

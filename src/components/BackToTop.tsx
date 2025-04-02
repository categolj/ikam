import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

interface BackToTopProps {
  /**
   * The scroll position at which the button should appear (in pixels)
   */
  threshold?: number;
  
  /**
   * Additional CSS classes for the button
   */
  className?: string;
}

/**
 * A reusable back-to-top button component that appears when the user scrolls
 * down the page and allows them to smoothly scroll back to the top.
 */
const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 300,
  className = ''
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showBackToTop) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 back-to-top-button">
      <Button
        onClick={scrollToTop}
        size="sm"
        className={`rounded-full w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary/90 shadow-md ${className}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BackToTop;

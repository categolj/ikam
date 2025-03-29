import { Link } from 'react-router-dom';
import { Terminal, Code, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              IK.AM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/?category=Tech" className="text-foreground hover:text-primary transition-colors">
              Tech
            </Link>
            <Link to="/?category=Development" className="text-foreground hover:text-primary transition-colors">
              Development
            </Link>
            <ThemeToggle />
            <Button variant="glow" size="sm" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              className="text-foreground hover:text-primary" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/?category=Tech" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tech
            </Link>
            <Link 
              to="/?category=Development" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Development
            </Link>
            <Button variant="glow" size="sm" className="flex items-center w-full justify-center">
              <Code className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
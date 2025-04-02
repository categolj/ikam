import { Link } from 'react-router-dom';
import { Terminal, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import BinaryRain from './BinaryRain';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm relative overflow-hidden">
      {/* Binary rain effect container for entire header */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <BinaryRain active={logoHovered} />
      </div>
      
      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <Terminal className="h-6 w-6 text-amber-500 dark:text-yellow-400" />
            <span className="bg-gradient-to-r from-amber-600 to-amber-400 dark:from-yellow-400 dark:to-yellow-300 bg-clip-text text-transparent">
              IK.AM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-amber-600 dark:hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <Link to="/aboutme" className="text-foreground hover:text-amber-600 dark:hover:text-yellow-400 transition-colors">
              About
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              className="text-foreground hover:text-amber-600 dark:hover:text-yellow-400" 
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
              className="text-foreground hover:text-amber-600 dark:hover:text-yellow-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/aboutme" 
              className="text-foreground hover:text-amber-600 dark:hover:text-yellow-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
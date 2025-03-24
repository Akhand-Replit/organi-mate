
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="text-xl font-bold tracking-tight">CompanyOS</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-secondary">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
        
        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
          <div className="container mx-auto py-4 px-6 flex flex-col gap-4">
            <NavLinks mobile />
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login">
                <Button variant="ghost" className="w-full justify-start">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full justify-start">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinksProps {
  mobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile }) => {
  const links = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  
  return (
    <div className={cn(
      mobile ? 'flex flex-col gap-4' : 'flex items-center gap-8'
    )}>
      {links.map((link) => (
        <Link 
          key={link.name} 
          to={link.href} 
          className={cn(
            'link-underline font-medium text-foreground/80 hover:text-foreground',
            mobile && 'py-2'
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default Navbar;

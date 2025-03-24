
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-tight">CompanyOS</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              A comprehensive management system for modern companies
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="#" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="#" icon={<Github size={18} />} label="GitHub" />
            </div>
          </div>
          
          <FooterLinkColumn 
            title="Product" 
            links={[
              { name: 'Features', href: '/features' },
              { name: 'Pricing', href: '/pricing' },
              { name: 'Testimonials', href: '/testimonials' },
              { name: 'Job Board', href: '/jobs' },
            ]} 
          />
          
          <FooterLinkColumn 
            title="Company" 
            links={[
              { name: 'About Us', href: '/about' },
              { name: 'Contact', href: '/contact' },
              { name: 'Careers', href: '/careers' },
              { name: 'Blog', href: '/blog' },
            ]} 
          />
          
          <FooterLinkColumn 
            title="Resources" 
            links={[
              { name: 'Help Center', href: '/help' },
              { name: 'Documentation', href: '/docs' },
              { name: 'API Reference', href: '/api' },
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Terms of Service', href: '/terms' },
            ]} 
          />
        </div>
        
        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} CompanyOS. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground/70 hover:text-primary transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

interface FooterLinkColumnProps {
  title: string;
  links: { name: string; href: string }[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ title, links }) => {
  return (
    <div className="col-span-1">
      <h3 className="font-medium text-foreground mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;

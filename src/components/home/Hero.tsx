
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block animate-fade-in">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
              <span className="inline-flex animate-pulse h-2 w-2 mr-2 rounded-full bg-primary"></span>
              Now in public beta
            </div>
          </div>
          
          <h1 className="animate-fade-in font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-6 text-balance">
            Elevate Your Company Management to the Next Level
          </h1>
          
          <p className="animate-fade-in text-muted-foreground text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-balance">
            A beautifully designed, all-in-one platform for company management, employee coordination, and talent acquisition.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/signup">
              <Button size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10 h-16 bottom-0"></div>
          <div className="glass-card rounded-xl overflow-hidden shadow-xl animate-float">
            <img 
              src="https://cdn.sanity.io/images/vb2qvo5f/production/0d1387e1668668f95e9fbc1e17b0748cc06f4943-2400x1260.png" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

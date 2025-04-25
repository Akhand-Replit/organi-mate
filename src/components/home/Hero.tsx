
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, CheckSquare, FileText, MessageSquare, Briefcase } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title }) => {
  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:bg-background/80 transition-colors">
      <div className="flex flex-col items-center text-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-block animate-fade-in">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
                <span className="inline-flex animate-pulse h-2 w-2 mr-2 rounded-full bg-primary"></span>
                Now in public beta
              </div>
            </div>
            
            <h1 className="animate-fade-in text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
              Streamline Your Company Management
            </h1>
            
            <p className="animate-fade-in text-lg md:text-xl text-muted-foreground mb-8">
              A comprehensive platform for organizing your company structure, managing employees, and streamlining operations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in">
              <Link to="/signup">
                <Button size="lg" className="group w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Feature Grid */}
          <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Building2 className="h-6 w-6 text-primary" />}
                  title="Branch Management"
                />
                <FeatureCard
                  icon={<Users className="h-6 w-6 text-primary" />}
                  title="Employee Management"
                />
                <FeatureCard
                  icon={<CheckSquare className="h-6 w-6 text-primary" />}
                  title="Task Tracking"
                />
                <FeatureCard
                  icon={<FileText className="h-6 w-6 text-primary" />}
                  title="Reporting"
                />
                <FeatureCard
                  icon={<MessageSquare className="h-6 w-6 text-primary" />}
                  title="Internal Communication"
                />
                <FeatureCard
                  icon={<Briefcase className="h-6 w-6 text-primary" />}
                  title="Job Board"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

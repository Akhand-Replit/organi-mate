
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Check, Building2, Users, Briefcase, CheckSquare, FileText, MessageSquare } from 'lucide-react';

const Index: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Streamline Your Company Management
              </h1>
              <p className="text-xl text-muted-foreground">
                A comprehensive platform for organizing your company structure, managing employees, and streamlining operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-6 border">
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Building2 className="h-8 w-8 text-primary" />}
                  title="Branch Management"
                />
                <FeatureCard
                  icon={<Users className="h-8 w-8 text-primary" />}
                  title="Employee Management"
                />
                <FeatureCard
                  icon={<CheckSquare className="h-8 w-8 text-primary" />}
                  title="Task Tracking"
                />
                <FeatureCard
                  icon={<FileText className="h-8 w-8 text-primary" />}
                  title="Reporting"
                />
                <FeatureCard
                  icon={<MessageSquare className="h-8 w-8 text-primary" />}
                  title="Internal Communication"
                />
                <FeatureCard
                  icon={<Briefcase className="h-8 w-8 text-primary" />}
                  title="Job Board"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Company
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools necessary for effective company management, employee oversight, and recruitment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureBlock
              icon={<Building2 className="h-12 w-12 text-primary" />}
              title="Branch Structure"
              description="Create and manage multiple branches with customized hierarchies and reporting structures."
            />
            <FeatureBlock
              icon={<Users className="h-12 w-12 text-primary" />}
              title="Employee Management"
              description="Manage employees across different roles with customized permissions and access controls."
            />
            <FeatureBlock
              icon={<CheckSquare className="h-12 w-12 text-primary" />}
              title="Task Assignment"
              description="Assign tasks to branches or individual employees with deadlines and priority levels."
            />
            <FeatureBlock
              icon={<FileText className="h-12 w-12 text-primary" />}
              title="Comprehensive Reporting"
              description="Generate detailed reports on employee productivity, task completion, and branch performance."
            />
            <FeatureBlock
              icon={<MessageSquare className="h-12 w-12 text-primary" />}
              title="Internal Communication"
              description="Built-in messaging system for seamless communication between all levels of management."
            />
            <FeatureBlock
              icon={<Briefcase className="h-12 w-12 text-primary" />}
              title="Integrated Job Board"
              description="Post job openings and manage applications directly through our platform."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your company's needs and scale as you grow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Demo"
              price="Free"
              duration="1 month"
              description="Try out our platform with limited features and capacity."
              features={[
                "1 company account",
                "1 branch only",
                "Maximum 5 employees",
                "Basic company management",
                "Limited reporting capabilities",
                "Basic task management",
                "No job board posting"
              ]}
              ctaText="Start Free Trial"
              ctaLink="/register"
              highlighted={false}
            />
            <PricingCard
              title="Pro"
              price="$25"
              duration="per month"
              description="Perfect for small to medium-sized businesses."
              features={[
                "1 company account",
                "3 branches",
                "10 employees per branch (30 total)",
                "Full company management",
                "Complete reporting with PDF exports",
                "Comprehensive task management",
                "Job board posting (limited listings)",
                "Full messaging capabilities"
              ]}
              ctaText="Get Started"
              ctaLink="/register"
              highlighted={true}
            />
            <PricingCard
              title="Custom"
              price="$50"
              duration="per month"
              description="Tailored solutions for larger organizations."
              features={[
                "1 company account",
                "Customizable number of branches",
                "Customizable number of employees",
                "All Pro plan features",
                "Priority support",
                "Advanced analytics",
                "Unlimited job board postings",
                "Custom branding options"
              ]}
              ctaText="Contact Us"
              ctaLink="/contact"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Streamline Your Company Management?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of companies already using our platform to manage their operations efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started Today
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline">
                  Browse Job Board
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title }) => {
  return (
    <div className="bg-background rounded-lg p-4 border flex flex-col items-center justify-center text-center">
      <div className="mb-3">{icon}</div>
      <h3 className="font-medium">{title}</h3>
    </div>
  );
};

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-background rounded-lg p-6 border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  duration,
  description,
  features,
  ctaText,
  ctaLink,
  highlighted
}) => {
  return (
    <div className={`
      rounded-lg p-6 border ${highlighted ? 'border-primary shadow-lg ring-1 ring-primary' : ''}
    `}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-muted-foreground"> {duration}</span>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to={ctaLink}>
        <Button 
          className="w-full" 
          variant={highlighted ? "default" : "outline"}
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
};

export default Index;

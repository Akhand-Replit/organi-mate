
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaLink: string;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  ctaText,
  ctaLink
}) => {
  return (
    <div 
      className={cn(
        "rounded-2xl p-8 relative transition-all duration-300 hover:shadow-xl",
        highlighted 
          ? "bg-primary/10 border-2 border-primary/30" 
          : "glass-card"
      )}
    >
      {highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground ml-2">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link to={ctaLink}>
        <Button 
          variant={highlighted ? "default" : "outline"} 
          className="w-full"
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const pricingTiers = [
    {
      name: "Demo Plan",
      price: "Free",
      description: "Perfect for trying out our platform for one month.",
      features: [
        "1 Company Account",
        "1 Branch Only",
        "Up to 5 Employees",
        "Basic Task Management",
        "Limited Reporting"
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/signup?plan=demo"
    },
    {
      name: "Pro Plan",
      price: "$25",
      description: "Ideal for small businesses looking to grow.",
      features: [
        "1 Company Account",
        "3 Branches",
        "10 Employees per Branch",
        "Full Task Management",
        "Complete Reporting with PDF Exports",
        "Job Board Access (Limited)",
        "Full Messaging Capabilities"
      ],
      highlighted: true,
      ctaText: "Choose Pro Plan",
      ctaLink: "/signup?plan=pro"
    },
    {
      name: "Custom Plan",
      price: "$50",
      description: "Tailored for larger organizations with custom needs.",
      features: [
        "1 Company Account",
        "Customizable Branches",
        "Customizable Employees per Branch",
        "Advanced Analytics",
        "Priority Support",
        "Unlimited Job Board Postings",
        "Custom Branding Options"
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works best for your business. All plans include core features with different limitations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlighted={tier.highlighted}
              ctaText={tier.ctaText}
              ctaLink={tier.ctaLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  highlighted?: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  company,
  highlighted = false
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col rounded-xl p-6 shadow-sm transition-all duration-300",
        highlighted 
          ? "bg-primary/10 border border-primary/20" 
          : "glass-card",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className="h-5 w-5 fill-primary text-primary mr-1" 
            strokeWidth={0}
          />
        ))}
      </div>
      <blockquote className="flex-1 mb-4 text-lg">"{quote}"</blockquote>
      <div className="mt-auto">
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}, {company}</div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "CompanyOS has transformed how we manage our teams across multiple locations. The hierarchy system makes delegation clear and efficient.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "Nexus Technologies",
      highlighted: true
    },
    {
      quote: "The reporting features alone have saved us countless hours of manual work. Generating PDF reports for leadership meetings is now a one-click process.",
      author: "David Chen",
      role: "Regional Manager",
      company: "Atlas Group"
    },
    {
      quote: "As a branch manager, I finally have clear visibility into my team's workload and progress. Task management has never been more intuitive.",
      author: "Miguel Hernandez",
      role: "Branch Manager",
      company: "Horizon Services"
    },
    {
      quote: "The job board integration helped us find qualified candidates faster than our previous recruitment methods. It's an all-in-one solution.",
      author: "Emily Watson",
      role: "HR Director",
      company: "Pinnacle Enterprises"
    },
    {
      quote: "We started with the Demo plan and quickly upgraded to Pro. The scalability of CompanyOS made the transition seamless as we grew.",
      author: "Alex Thompson",
      role: "CEO",
      company: "Vertex Startups"
    },
    {
      quote: "The customer support team is exceptional. They helped us customize our instance to perfectly match our organizational structure.",
      author: "Olivia Parker",
      role: "IT Manager",
      company: "Meridian Group"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Trusted by Growing Companies
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our customers have to say about how CompanyOS has improved their organizational efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              highlighted={testimonial.highlighted}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

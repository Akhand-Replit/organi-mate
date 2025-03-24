
import React from 'react';
import { 
  Users, 
  Briefcase, 
  ClipboardList, 
  BarChart4, 
  MessageSquare, 
  LockKeyhole 
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Role-based Management",
      description: "Intuitive hierarchy with administrators, managers, and employees, each with tailored permissions and interfaces."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Branch Management",
      description: "Organize your company by branches, departments, or teams with specialized coordination and reporting."
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
      title: "Task Assignment",
      description: "Assign, track, and manage tasks with clarity and accountability across all organizational levels."
    },
    {
      icon: <BarChart4 className="h-6 w-6 text-primary" />,
      title: "Advanced Reporting",
      description: "Generate comprehensive reports with insightful metrics and data visualization for informed decision-making."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Integrated Messaging",
      description: "Built-in communication system for seamless collaboration between managers and employees."
    },
    {
      icon: <LockKeyhole className="h-6 w-6 text-primary" />,
      title: "Secure & Scalable",
      description: "Enterprise-grade security with flexible subscription plans that grow with your business needs."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Designed for Modern Management
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Our platform combines elegantly designed interfaces with powerful functionality to streamline your company's operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="rounded-full bg-primary/10 p-3 w-fit mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

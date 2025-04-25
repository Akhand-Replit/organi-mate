
import React from 'react';
import { Building2, Users, CheckSquare, FileText, MessageSquare, Briefcase } from 'lucide-react';

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

const FeaturesSection: React.FC = () => {
  return (
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
  );
};

export default FeaturesSection;

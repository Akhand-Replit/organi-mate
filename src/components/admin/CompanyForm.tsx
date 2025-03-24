
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createUser } from '@/lib/auth';
import { UserRole } from '@/lib/auth';
import { 
  Building2, 
  Mail, 
  Lock, 
  Loader2
} from 'lucide-react';
import InputWithIcon from '@/components/ui/input-with-icon';

interface CompanyFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => Promise<void>;
  isLoading: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <InputWithIcon
          id="name"
          name="name"
          label="Company Name"
          icon={Building2}
          placeholder="Enter company name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <InputWithIcon
          id="email"
          name="email"
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="Enter company email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <InputWithIcon
          id="password"
          name="password"
          label="Password"
          icon={Lock}
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        
        <InputWithIcon
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Company...
            </span>
          ) : (
            'Create Company'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;

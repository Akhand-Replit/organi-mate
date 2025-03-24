
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  id,
  label,
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id={id}
          className={`pl-10 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputWithIcon;

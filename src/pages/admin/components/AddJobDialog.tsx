
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { jobsTable } from '@/integrations/supabase/tables';
import { useToast } from '@/hooks/use-toast';
import { jobFormSchema, type JobFormValues } from './jobs/JobFormSchema';
import { JobFormBasicInfo } from './jobs/JobFormBasicInfo';
import { JobFormLocation } from './jobs/JobFormLocation';
import { JobFormTypeCategory } from './jobs/JobFormTypeCategory';
import { JobFormDescription } from './jobs/JobFormDescription';

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddJobDialog({ open, onOpenChange, onSuccess }: AddJobDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: '',
      job_type: 'full-time',
      category: 'technology',
      salary_range: '',
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  async function onSubmit(values: JobFormValues) {
    try {
      const { error } = await jobsTable.create({
        ...values,
        is_active: true,
        employment_type: values.job_type,
      });
      
      if (error) throw error;
      
      toast({
        title: "Job created successfully",
        description: "The job listing has been published",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast({
        title: "Error creating job",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Create a new job listing to be published on the job board.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <JobFormBasicInfo form={form} />
            <JobFormLocation form={form} />
            <JobFormTypeCategory form={form} />
            <JobFormDescription form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().min(3, { message: 'Job title must be at least 3 characters' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  requirements: z.string().min(20, { message: 'Requirements must be at least 20 characters' }),
  job_type: z.string().min(1, { message: 'Job type is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  salary_range: z.string().optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

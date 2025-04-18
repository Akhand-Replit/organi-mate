
import { supabase } from './client';
import type { 
  Task, 
  Report, 
  JobCategory, 
  Job, 
  JobInsert,
  JobUpdate,
  JobApplication,
  JobApplicationInsert,
  JobApplicationUpdate
} from '@/lib/supabase-types';

// Tasks
export const tasksTable = {
  getAll: () => supabase.from('tasks').select('*'),
  getById: (id: string) => supabase.from('tasks').select('*').eq('id', id).single(),
  getByAssignee: (userId: string) => supabase.from('tasks').select('*').eq('assigned_to', userId),
  getByBranch: (branchId: string) => supabase.from('tasks').select('*').eq('branch_id', branchId),
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
    supabase.from('tasks').insert(task),
  update: (id: string, updates: Partial<Task>) => 
    supabase.from('tasks').update(updates).eq('id', id),
  delete: (id: string) => supabase.from('tasks').delete().eq('id', id),
};

// Reports
export const reportsTable = {
  getAll: () => supabase.from('reports').select('*'),
  getById: (id: string) => supabase.from('reports').select('*').eq('id', id).single(),
  getByUser: (userId: string) => supabase.from('reports').select('*').eq('user_id', userId),
  getByBranch: (branchId: string) => supabase.from('reports').select('*').eq('branch_id', branchId),
  create: (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => 
    supabase.from('reports').insert(report),
  update: (id: string, updates: Partial<Report>) => 
    supabase.from('reports').update(updates).eq('id', id),
  delete: (id: string) => supabase.from('reports').delete().eq('id', id),
};

// Job Categories
export const jobCategoriesTable = {
  getAll: () => supabase.from('job_categories').select('*'),
  getById: (id: string) => supabase.from('job_categories').select('*').eq('id', id).single(),
  create: (category: Omit<JobCategory, 'id' | 'created_at'>) => 
    supabase.from('job_categories').insert(category),
  update: (id: string, updates: Partial<JobCategory>) => 
    supabase.from('job_categories').update(updates).eq('id', id),
  delete: (id: string) => supabase.from('job_categories').delete().eq('id', id),
};

// Jobs table utilities with proper typing
export const jobsTable = {
  getAll: () => supabase.from('jobs').select('*'),
  getById: (id: string) => supabase.from('jobs').select('*').eq('id', id).single(),
  getByCompany: (companyId: string) => supabase.from('jobs').select('*').eq('company_id', companyId),
  search: (query: string) => supabase.from('jobs').select('*').ilike('title', `%${query}%`),
  
  // Use type annotation to avoid excessive type inference
  getByCategory: (categoryId: string) => {
    return supabase.from('jobs').select('*').eq('category', categoryId);
  },
  
  getByEmploymentType: (type: string) => {
    return supabase.from('jobs').select('*').eq('employment_type', type);
  },
  
  getByExperienceLevel: (level: string) => {
    return supabase.from('jobs').select('*').eq('experience_level', level);
  },
  
  create: (job: JobInsert) => {
    return supabase.from('jobs').insert(job);
  },
  
  update: (id: string, updates: JobUpdate) => {
    return supabase.from('jobs').update(updates).eq('id', id);
  },
};

// Job Applications table utilities with proper typing
export const jobApplicationsTable = {
  getAll: () => supabase.from('job_applications').select('*'),
  getById: (id: string) => supabase.from('job_applications').select('*').eq('id', id).single(),
  getByJob: (jobId: string) => supabase.from('job_applications').select('*').eq('job_id', jobId),
  getByApplicant: (applicantId: string) => supabase.from('job_applications').select('*').eq('applicant_id', applicantId),
  
  updateStatus: (id: string, status: string, updatedBy: string) => {
    return supabase.from('job_applications').update({
      status,
      status_updated_at: new Date().toISOString(),
      status_updated_by: updatedBy
    }).eq('id', id);
  },
  
  setInterview: (id: string, interviewDate: string) => {
    return supabase.from('job_applications').update({
      interview_date: interviewDate
    }).eq('id', id);
  },
  
  addNotes: (id: string, notes: string) => {
    return supabase.from('job_applications').update({
      notes
    }).eq('id', id);
  },
};

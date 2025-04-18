
// This file provides custom type definitions for Supabase tables that 
// don't appear in the auto-generated types.
// Use this for tables created after the initial setup or for local development.

import { Database } from "@/integrations/supabase/types";

// Extend the Database type to include our custom tables
export interface CustomDatabase extends Database {
  public: Database["public"] & {
    Tables: Database["public"]["Tables"] & {
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
          sender_name: string | null;
          receiver_name: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
          sender_name?: string | null;
          receiver_name?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
          sender_name?: string | null;
          receiver_name?: string | null;
        };
      };
    };
  };
}

// Custom client types for Supabase operations
export type MessageRow = CustomDatabase["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = CustomDatabase["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = CustomDatabase["public"]["Tables"]["messages"]["Update"];

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assigned_by: string;
  assigned_to: string;
  company_id: string;
  branch_id: string | null;
  is_active: boolean;
};

export type Report = {
  id: string;
  title: string;
  content: string;
  report_type: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  company_id: string;
  branch_id: string | null;
  is_active: boolean;
};

export type JobCategory = {
  id: string;
  name: string;
  created_at: string;
};

// Job type definition
export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  job_type: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company_id?: string | null;
  salary_range?: string | null;
  employment_type?: string;
  experience_level?: string | null;
  skills?: string[] | null;
  benefits?: string[] | null;
};

// JobApplication type definition
export type JobApplication = {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  status_updated_at?: string | null;
  status_updated_by?: string | null;
  interview_date?: string | null;
  notes?: string | null;
  resume_url?: string | null;
  cover_letter?: string | null;
};

// Types for inserting data
export type JobInsert = Omit<Job, 'id' | 'created_at' | 'updated_at'>;
export type JobApplicationInsert = Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>;

// Types for updating data
export type JobUpdate = Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
export type JobApplicationUpdate = Partial<Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>>;

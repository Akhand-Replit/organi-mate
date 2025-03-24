
-- Create company applications table for tracking company registration requests
CREATE TABLE IF NOT EXISTS public.company_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS to company applications
ALTER TABLE IF EXISTS public.company_applications ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all applications
CREATE POLICY "Admins can view all company applications" 
  ON public.company_applications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Allow admins to update applications
CREATE POLICY "Admins can update company applications" 
  ON public.company_applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Allow anyone to insert applications
CREATE POLICY "Anyone can submit a company application" 
  ON public.company_applications FOR INSERT 
  WITH CHECK (true);

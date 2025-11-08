-- Create jobs table for full-time positions
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  employer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  responsibilities text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  location text,
  job_type text DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract')),
  experience_level text DEFAULT 'entry-level' CHECK (experience_level IN ('entry-level', 'mid-level', 'senior', 'lead')),
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'USD',
  skills_required text[] DEFAULT '{}',
  is_remote boolean DEFAULT false,
  application_deadline date,
  start_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'draft')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs
CREATE POLICY "Everyone can view active jobs"
  ON public.jobs
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Employers can manage own jobs"
  ON public.jobs
  FOR ALL
  USING (employer_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_location ON public.jobs(location);
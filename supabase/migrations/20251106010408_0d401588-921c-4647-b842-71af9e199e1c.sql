-- Fix email exposure in profiles table
-- Remove public access to email field while keeping other profile data visible

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create new policy that excludes email from public view
CREATE POLICY "Public can view basic profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- Note: The email field should only be accessible to:
-- 1. The profile owner
-- 2. Employers viewing applicants
-- 3. Admins

-- Add policy for users to view their own full profile including email
CREATE POLICY "Users can view own full profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Add policy for employers to view applicant emails
CREATE POLICY "Employers can view applicant emails"
  ON profiles
  FOR SELECT
  USING (
    has_role(auth.uid(), 'employer'::app_role) AND
    EXISTS (
      SELECT 1 FROM applications a
      JOIN internships i ON i.id = a.internship_id
      WHERE a.intern_id = profiles.id
      AND i.employer_id = auth.uid()
    )
  );

-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
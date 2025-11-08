-- Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('notification', 'marketing', 'transactional', 'system')),
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  variables jsonb DEFAULT '[]'::jsonb,
  from_name text DEFAULT 'Product Interns',
  from_email text DEFAULT 'noreply@productinterns.com',
  is_active boolean DEFAULT true,
  description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for email templates
CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view email templates"
  ON public.email_templates
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_email_templates_category ON public.email_templates(category);
CREATE INDEX idx_email_templates_is_active ON public.email_templates(is_active);

-- Insert default templates
INSERT INTO public.email_templates (name, category, subject, html_content, text_content, variables, description) VALUES
(
  'welcome-intern',
  'notification',
  'Welcome to Product Interns, {{name}}!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3B82F6;">Welcome to Product Interns!</h1>
    <p>Hi {{name}},</p>
    <p>Thank you for joining Product Interns. We''re excited to have you on board!</p>
    <p>You can start exploring internship opportunities right away.</p>
    <a href="{{dashboard_url}}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Go to Dashboard</a>
    <p>Best regards,<br>The Product Interns Team</p>
  </div>',
  'Welcome to Product Interns! Hi {{name}}, Thank you for joining Product Interns. Visit: {{dashboard_url}}',
  '["name", "dashboard_url"]'::jsonb,
  'Welcome email sent to new intern users'
),
(
  'welcome-employer',
  'notification',
  'Welcome to Product Interns - Start Hiring!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #10B981;">Welcome to Product Interns!</h1>
    <p>Hi {{company_name}},</p>
    <p>Thank you for joining Product Interns. Start posting internship opportunities and find the perfect candidates!</p>
    <a href="{{dashboard_url}}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Post Your First Internship</a>
    <p>Best regards,<br>The Product Interns Team</p>
  </div>',
  'Welcome to Product Interns! Start posting opportunities at: {{dashboard_url}}',
  '["company_name", "dashboard_url"]'::jsonb,
  'Welcome email sent to new employer users'
),
(
  'application-received',
  'notification',
  'Application Received - {{position_title}}',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3B82F6;">Application Received!</h1>
    <p>Hi {{applicant_name}},</p>
    <p>We have received your application for <strong>{{position_title}}</strong> at {{company_name}}.</p>
    <p>The employer will review your application and get back to you soon.</p>
    <a href="{{application_url}}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Application Status</a>
    <p>Good luck!<br>The Product Interns Team</p>
  </div>',
  'Application received for {{position_title}} at {{company_name}}. Track status: {{application_url}}',
  '["applicant_name", "position_title", "company_name", "application_url"]'::jsonb,
  'Confirmation email sent when an application is received'
),
(
  'interview-scheduled',
  'notification',
  'Interview Scheduled - {{position_title}}',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #10B981;">Interview Scheduled!</h1>
    <p>Hi {{candidate_name}},</p>
    <p>Great news! {{company_name}} has scheduled an interview with you for the <strong>{{position_title}}</strong> position.</p>
    <div style="background: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Date:</strong> {{interview_date}}</p>
      <p style="margin: 5px 0;"><strong>Time:</strong> {{interview_time}}</p>
      <p style="margin: 5px 0;"><strong>Location:</strong> {{interview_location}}</p>
    </div>
    <a href="{{calendar_link}}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Add to Calendar</a>
    <p>Best regards,<br>The Product Interns Team</p>
  </div>',
  'Interview scheduled for {{position_title}} on {{interview_date}} at {{interview_time}}. Location: {{interview_location}}',
  '["candidate_name", "company_name", "position_title", "interview_date", "interview_time", "interview_location", "calendar_link"]'::jsonb,
  'Email sent when an interview is scheduled'
),
(
  'monthly-newsletter',
  'marketing',
  'Product Interns Monthly Newsletter - {{month}}',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3B82F6;">This Month at Product Interns</h1>
    <p>Hi {{name}},</p>
    <h2>Latest Opportunities</h2>
    <p>{{opportunities_summary}}</p>
    <h2>Success Stories</h2>
    <p>{{success_stories}}</p>
    <a href="{{website_url}}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Visit Website</a>
    <p>Best regards,<br>The Product Interns Team</p>
    <p style="font-size: 12px; color: #6B7280;">You are receiving this because you are a member of Product Interns. <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
  </div>',
  'Product Interns Monthly Newsletter. Latest opportunities and success stories. Visit: {{website_url}}',
  '["name", "month", "opportunities_summary", "success_stories", "website_url", "unsubscribe_url"]'::jsonb,
  'Monthly newsletter sent to all users'
);
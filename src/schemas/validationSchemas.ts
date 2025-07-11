
import { z } from 'zod';

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).max(20, 'Maximum 20 skills allowed').optional(),
  locations: z.array(z.string()).max(10, 'Maximum 10 locations allowed').optional(),
  company_name: z.string().optional(),
  position: z.string().optional(),
});

// Internship application schema
export const applicationSchema = z.object({
  cover_letter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resume_url: z.string().url('Invalid resume URL').optional(),
});

// Internship posting schema
export const internshipSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  stipend_amount: z.number().min(0, 'Stipend must be positive').optional(),
  stipend_currency: z.string().default('USD'),
  skills_required: z.array(z.string()).min(1, 'At least one skill is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  benefits: z.array(z.string()).optional(),
  is_remote: z.boolean().default(false),
  application_deadline: z.string().optional(),
  start_date: z.string().optional(),
});

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  recipient_id: z.string().uuid('Invalid recipient ID'),
  application_id: z.string().uuid('Invalid application ID').optional(),
});

// Company schema
export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  website: z.string().url('Invalid website URL').optional(),
  industry: z.string().min(2, 'Industry is required'),
  size: z.string().min(1, 'Company size is required'),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  benefits: z.array(z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type InternshipFormData = z.infer<typeof internshipSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;

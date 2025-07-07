-- Create user role enum
CREATE TYPE user_role AS ENUM ('intern', 'employer', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'intern',
  avatar_url TEXT,
  company_name TEXT,
  position TEXT,
  bio TEXT,
  skills TEXT[],
  locations TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  industry TEXT,
  size TEXT,
  logo_url TEXT,
  founded_year INTEGER,
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  location TEXT,
  duration TEXT,
  stipend_amount INTEGER,
  stipend_currency TEXT DEFAULT 'USD',
  application_deadline DATE,
  start_date DATE,
  skills_required TEXT[],
  is_remote BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  intern_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(internship_id, intern_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Everyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Employers can manage companies" ON public.companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'employer')
);

-- Internships policies
CREATE POLICY "Everyone can view active internships" ON public.internships FOR SELECT USING (status = 'active');
CREATE POLICY "Employers can manage own internships" ON public.internships FOR ALL USING (employer_id = auth.uid());

-- Applications policies
CREATE POLICY "Interns can view own applications" ON public.applications FOR SELECT USING (intern_id = auth.uid());
CREATE POLICY "Employers can view applications for their internships" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM internships WHERE id = internship_id AND employer_id = auth.uid())
);
CREATE POLICY "Interns can create applications" ON public.applications FOR INSERT WITH CHECK (intern_id = auth.uid());
CREATE POLICY "Employers can update applications for their internships" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM internships WHERE id = internship_id AND employer_id = auth.uid())
);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- Storage policies for resumes
CREATE POLICY "Users can upload own resume" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can view own resume" ON storage.objects FOR SELECT USING (
  bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Employers can view resumes for applications" ON storage.objects FOR SELECT USING (
  bucket_id = 'resumes' AND EXISTS (
    SELECT 1 FROM applications a
    JOIN internships i ON a.internship_id = i.id
    WHERE i.employer_id = auth.uid() AND a.resume_url LIKE '%' || name || '%'
  )
);

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for company logos
CREATE POLICY "Anyone can view company logos" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');
CREATE POLICY "Employers can upload company logos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'employer'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
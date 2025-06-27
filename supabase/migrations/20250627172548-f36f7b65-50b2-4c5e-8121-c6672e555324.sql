
-- Create enum types for user roles and application status
CREATE TYPE public.user_role AS ENUM ('intern', 'employer', 'admin');
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');
CREATE TYPE public.internship_status AS ENUM ('draft', 'active', 'closed', 'paused');

-- Create profiles table to store additional user information
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
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  skills_required TEXT[],
  location TEXT,
  remote BOOLEAN DEFAULT FALSE,
  duration TEXT,
  stipend TEXT,
  status internship_status DEFAULT 'draft',
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_deadline DATE,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  intern_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(internship_id, intern_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles table
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for companies table
CREATE POLICY "Anyone can view active companies" 
  ON public.companies FOR SELECT 
  USING (TRUE);

CREATE POLICY "Employers can manage their companies" 
  ON public.companies FOR ALL 
  USING (employer_id = auth.uid() AND public.has_role('employer'));

CREATE POLICY "Admins can manage all companies" 
  ON public.companies FOR ALL 
  USING (public.has_role('admin'));

-- RLS Policies for internships table
CREATE POLICY "Anyone can view active internships" 
  ON public.internships FOR SELECT 
  USING (status = 'active' OR employer_id = auth.uid() OR public.has_role('admin'));

CREATE POLICY "Employers can manage their internships" 
  ON public.internships FOR ALL 
  USING (employer_id = auth.uid() AND public.has_role('employer'));

CREATE POLICY "Admins can manage all internships" 
  ON public.internships FOR ALL 
  USING (public.has_role('admin'));

-- RLS Policies for applications table
CREATE POLICY "Interns can view their applications" 
  ON public.applications FOR SELECT 
  USING (intern_id = auth.uid());

CREATE POLICY "Employers can view applications for their internships" 
  ON public.applications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.internships 
    WHERE id = internship_id AND employer_id = auth.uid()
  ));

CREATE POLICY "Interns can create applications" 
  ON public.applications FOR INSERT 
  WITH CHECK (intern_id = auth.uid() AND public.has_role('intern'));

CREATE POLICY "Employers can update application status" 
  ON public.applications FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.internships 
    WHERE id = internship_id AND employer_id = auth.uid()
  ));

CREATE POLICY "Admins can view all applications" 
  ON public.applications FOR ALL 
  USING (public.has_role('admin'));

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages" 
  ON public.messages FOR SELECT 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update read status" 
  ON public.messages FOR UPDATE 
  USING (recipient_id = auth.uid());

CREATE POLICY "Admins can view all messages" 
  ON public.messages FOR SELECT 
  USING (public.has_role('admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'intern')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON public.companies 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internships_updated_at 
  BEFORE UPDATE ON public.internships 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON public.applications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Create the user_role enum type that's missing
CREATE TYPE public.user_role AS ENUM ('intern', 'employer', 'admin');

-- Verify the profiles table has the correct structure and constraints
-- (This should already exist, but we're ensuring it's properly configured)
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'intern'::user_role;

-- Ensure the handle_new_user function works correctly with the enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'intern'::user_role),
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

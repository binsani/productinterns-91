-- Create the user_role enum type
CREATE TYPE public.user_role AS ENUM ('intern', 'employer', 'admin');

-- Create trigger to handle new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
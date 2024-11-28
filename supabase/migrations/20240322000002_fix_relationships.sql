-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view blood requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Authenticated users can create blood requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Users can delete their own requests" ON public.blood_requests;

-- Drop existing tables and functions
DROP TABLE IF EXISTS public.blood_requests;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate profiles table
DROP TABLE IF EXISTS public.profiles;
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  full_name TEXT,
  avatar_url TEXT,
  blood_type TEXT,
  contact_number TEXT,
  cnic_id TEXT,
  location TEXT
);

-- Create blood_requests table with correct relationships
CREATE TABLE public.blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  cnic_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('donor', 'receiver')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view blood requests"
  ON public.blood_requests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blood requests"
  ON public.blood_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own requests"
  ON public.blood_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests"
  ON public.blood_requests FOR DELETE
  USING (auth.uid() = user_id);

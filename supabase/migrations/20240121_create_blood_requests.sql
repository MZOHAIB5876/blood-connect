-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    blood_type VARCHAR NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    location VARCHAR NOT NULL,
    coordinates VARCHAR,
    contact_number VARCHAR NOT NULL,
    cnic_id VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('donor', 'receiver')),
    status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to view all requests
CREATE POLICY "View all requests" ON blood_requests
    FOR SELECT
    USING (true);

-- Allow authenticated users to create requests
CREATE POLICY "Users can create requests" ON blood_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own requests
CREATE POLICY "Users can update own requests" ON blood_requests
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own requests
CREATE POLICY "Users can delete own requests" ON blood_requests
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blood_requests_updated_at
    BEFORE UPDATE ON blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

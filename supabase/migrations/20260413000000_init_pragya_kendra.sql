-- Create public.applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR UNIQUE NOT NULL,
    service_type VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'pending',
    full_name VARCHAR NOT NULL,
    father_name VARCHAR,
    date_of_birth DATE,
    mobile_number VARCHAR,
    address TEXT,
    document_url VARCHAR,
    document_key VARCHAR,
    form_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an application
CREATE POLICY "Allow anonymous inserts" 
ON public.applications FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public tracking for tracking codes
CREATE POLICY "Allow public reading" 
ON public.applications FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow admin full access updates
CREATE POLICY "Allow admin updates" 
ON public.applications FOR UPDATE 
TO authenticated 
USING (true);

-- Allow admin deletes
CREATE POLICY "Allow admin deletes" 
ON public.applications FOR DELETE 
TO authenticated 
USING (true);

-- Create documents bucket for the file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'documents' bucket
CREATE POLICY "Allow anonymous document uploads"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public document reading"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'documents');

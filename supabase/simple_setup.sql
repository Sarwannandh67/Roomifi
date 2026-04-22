-- Simple setup for Roomi AI Harmony chat feature
-- This simplified SQL should work on a fresh Supabase instance

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    room_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert a default room
INSERT INTO rooms (name, description)
VALUES ('General', 'General chat room for all roommates');

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Allow authenticated users to read rooms" 
ON rooms FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert rooms" 
ON rooms FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policies for messages
CREATE POLICY "Allow authenticated users to read messages" 
ON messages FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert messages" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Enable realtime for these tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

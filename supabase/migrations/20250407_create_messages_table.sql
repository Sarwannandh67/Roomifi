-- Create messages table for group chat
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all messages
CREATE POLICY "Allow authenticated users to read messages" 
ON public.messages FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to insert their own messages
CREATE POLICY "Allow authenticated users to insert their own messages" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK (sender = auth.email() OR sender = auth.uid());

-- Create policy to allow users to update their own messages
CREATE POLICY "Allow users to update their own messages" 
ON public.messages FOR UPDATE 
TO authenticated 
USING (sender = auth.email() OR sender = auth.uid());

-- Create policy to allow users to delete their own messages
CREATE POLICY "Allow users to delete their own messages" 
ON public.messages FOR DELETE 
TO authenticated 
USING (sender = auth.email() OR sender = auth.uid());

-- Create rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all rooms
CREATE POLICY "Allow authenticated users to read rooms" 
ON public.rooms FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to create rooms
CREATE POLICY "Allow authenticated users to create rooms" 
ON public.rooms FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow room creator to update room
CREATE POLICY "Allow room creator to update room" 
ON public.rooms FOR UPDATE 
TO authenticated 
USING (created_by = auth.uid());

-- Create policy to allow room creator to delete room
CREATE POLICY "Allow room creator to delete room" 
ON public.rooms FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());

-- Create room_members junction table for managing room membership
CREATE TABLE IF NOT EXISTS public.room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(room_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to see room members
CREATE POLICY "Allow authenticated users to see room members" 
ON public.room_members FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to join rooms
CREATE POLICY "Allow authenticated users to join rooms" 
ON public.room_members FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to leave rooms
CREATE POLICY "Allow users to leave rooms" 
ON public.room_members FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Create realtime publication for messages
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.messages, public.rooms, public.room_members;

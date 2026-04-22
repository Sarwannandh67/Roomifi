-- Complete Supabase database setup for Roomi AI Harmony app

-- USERS EXTENSION (already exists in Supabase)
-- We'll use the built-in auth.users table for user management

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    preferred_currency TEXT DEFAULT 'USD',
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view any profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- HOUSEHOLDS TABLE
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households
CREATE POLICY "Users can view their households" 
ON public.households FOR SELECT 
TO authenticated 
USING (
    id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can create households" 
ON public.households FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Household members can update household" 
ON public.households FOR UPDATE 
TO authenticated 
USING (
    id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

-- HOUSEHOLD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'admin', 'member'
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(household_id, user_id)
);

-- Enable RLS
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for household_members
CREATE POLICY "Users can view members of their households" 
ON public.household_members FOR SELECT 
TO authenticated 
USING (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can join households" 
ON public.household_members FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave households" 
ON public.household_members FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT NOT NULL,
    category TEXT,
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    receipt_url TEXT,
    split_type TEXT DEFAULT 'equal', -- 'equal', 'percentage', 'fixed'
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses in their households" 
ON public.expenses FOR SELECT 
TO authenticated 
USING (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can create expenses in their households" 
ON public.expenses FOR INSERT 
TO authenticated 
WITH CHECK (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    ) AND created_by = auth.uid()
);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses FOR UPDATE 
TO authenticated 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());

-- EXPENSE SPLITS TABLE
CREATE TABLE IF NOT EXISTS public.expense_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expense_splits
CREATE POLICY "Users can view expense splits in their households" 
ON public.expense_splits FOR SELECT 
TO authenticated 
USING (
    expense_id IN (
        SELECT id FROM public.expenses WHERE household_id IN (
            SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can update their own expense splits" 
ON public.expense_splits FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- CHORES TABLE
CREATE TABLE IF NOT EXISTS public.chores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT, -- 'daily', 'weekly', 'monthly', 'once'
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chores
CREATE POLICY "Users can view chores in their households" 
ON public.chores FOR SELECT 
TO authenticated 
USING (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can create chores in their households" 
ON public.chores FOR INSERT 
TO authenticated 
WITH CHECK (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update chores in their households" 
ON public.chores FOR UPDATE 
TO authenticated 
USING (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own chores" 
ON public.chores FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());

-- REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    remind_at TIMESTAMPTZ NOT NULL,
    remind_to UUID[] DEFAULT ARRAY[]::UUID[], -- Array of user IDs to remind
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly'
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reminders
CREATE POLICY "Users can view reminders in their households" 
ON public.reminders FOR SELECT 
TO authenticated 
USING (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    ) OR auth.uid() = ANY(remind_to)
);

CREATE POLICY "Users can create reminders in their households" 
ON public.reminders FOR INSERT 
TO authenticated 
WITH CHECK (
    household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders FOR UPDATE 
TO authenticated 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT, -- 'expense', 'chore', 'reminder', 'system'
    related_id UUID, -- ID of the related item (expense, chore, etc.)
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- FEATURE VOTING TABLE
CREATE TABLE IF NOT EXISTS public.feature_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(feature_id, user_id)
);

-- Enable RLS
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_votes
CREATE POLICY "Users can view all feature votes" 
ON public.feature_votes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create their own feature votes" 
ON public.feature_votes FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own feature votes" 
ON public.feature_votes FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    interval TEXT NOT NULL, -- 'month', 'year'
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- No RLS needed for subscription_plans as it's public information

-- USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL, -- 'active', 'canceled', 'expired'
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    payment_provider TEXT, -- 'stripe', 'paypal', etc.
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- CHAT MESSAGES TABLE (already created in previous migration)
-- Ensure it exists
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- CHAT ROOMS TABLE (already created in previous migration)
-- Ensure it exists
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ROOM MEMBERS TABLE (already created in previous migration)
-- Ensure it exists
CREATE TABLE IF NOT EXISTS public.room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(room_id, user_id)
);

-- Create realtime publication for all tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.profiles,
    public.households,
    public.household_members,
    public.expenses,
    public.expense_splits,
    public.chores,
    public.reminders,
    public.notifications,
    public.feature_votes,
    public.subscription_plans,
    public.user_subscriptions,
    public.messages,
    public.rooms,
    public.room_members;

-- Insert some initial subscription plans
INSERT INTO public.subscription_plans (id, name, description, price, currency, interval, features)
VALUES
    ('free', 'Free Plan', 'Basic features for roommates', 0, 'USD', 'month', '{"max_households": 1, "max_roommates": 4, "features": ["Expense tracking", "Chore management", "Basic reminders"]}'::jsonb),
    ('premium_monthly', 'Premium Monthly', 'Advanced features with unlimited access', 9.99, 'USD', 'month', '{"max_households": null, "max_roommates": null, "features": ["Unlimited expense tracking", "Advanced chore rotation", "Unlimited reminders", "Premium chat", "Data exports", "Priority support"]}'::jsonb),
    ('premium_yearly', 'Premium Yearly', 'Premium features at a discounted yearly rate', 99.99, 'USD', 'year', '{"max_households": null, "max_roommates": null, "features": ["Unlimited expense tracking", "Advanced chore rotation", "Unlimited reminders", "Premium chat", "Data exports", "Priority support"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.email, 'https://api.dicebear.com/7.x/initials/svg?seed=' || new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

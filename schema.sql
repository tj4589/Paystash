-- Create a table for public profiles using the auth.users table references
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  phone text unique,
  nin text,
  balance numeric default 0.00,
  public_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy if not exists "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy if not exists "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

-- Create a table for transactions
create table if not exists public.transactions (
  id text primary key,
  sender_id uuid references auth.users,
  recipient_id uuid references auth.users,
  amount numeric not null,
  type text not null,
  status text default 'pending',
  title text,
  signature text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;
create policy if not exists "Users can view their own transactions." on public.transactions for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- ------------------------------------------------------------------
-- REPAIR SCRIPT (Run this if you see Row Level Security errors)
-- ------------------------------------------------------------------

-- 1. Ensure public_key exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='public_key') THEN
    ALTER TABLE public.profiles ADD COLUMN public_key text;
  END IF;
END $$;

-- 2. Correct Insert Policy (Allows Top-ups where sender is NULL)
DROP POLICY IF EXISTS "Users can insert their own transactions." ON public.transactions;
CREATE POLICY "Users can insert their own transactions." ON public.transactions 
FOR INSERT WITH CHECK (auth.uid() = recipient_id OR auth.uid() = sender_id);

-- 3. Correct Update Policy
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- 4. RPC for QR Settlement
CREATE OR REPLACE FUNCTION claim_qr_payment(
  p_id text,
  p_amount numeric,
  p_sender_public_key text,
  p_signature text,
  p_metadata jsonb
) RETURNS void AS $$
DECLARE
  v_sender_id uuid;
  v_recipient_id uuid;
  v_sender_balance numeric;
BEGIN
  v_recipient_id := auth.uid();
  SELECT id, balance INTO v_sender_id, v_sender_balance FROM public.profiles WHERE public_key = p_sender_public_key;
  IF v_sender_id IS NULL THEN RAISE EXCEPTION 'Sender not found. Sync keys first.'; END IF;
  IF v_sender_id = v_recipient_id THEN RAISE EXCEPTION 'You cannot claim your own payment.'; END IF;
  IF EXISTS (SELECT 1 FROM public.transactions WHERE id = p_id) THEN RAISE EXCEPTION 'Already claimed.'; END IF;
  IF v_sender_balance < p_amount THEN RAISE EXCEPTION 'Insufficient funds.'; END IF;

  UPDATE public.profiles SET balance = balance - p_amount WHERE id = v_sender_id;
  UPDATE public.profiles SET balance = balance + p_amount WHERE id = v_recipient_id;

  INSERT INTO public.transactions (id, sender_id, recipient_id, amount, type, status, title, signature, metadata, created_at)
  VALUES (p_id, v_sender_id, v_recipient_id, p_amount, 'credit', 'completed', 'QR Payment Received', p_signature, p_metadata, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

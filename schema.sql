-- Create a table for public profiles using the auth.users table references
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  phone text unique,
  nin text,
  balance numeric default 0.00,
  public_key text, -- Stores the user's latest public key for signature verification
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Create a table for transactions
create table public.transactions (
  id text primary key, -- accepting string IDs from frontend (uuids or custom)
  sender_id uuid references auth.users,
  recipient_id uuid references auth.users,
  amount numeric not null,
  type text not null, -- 'credit', 'debit', 'topup'
  status text default 'pending',
  title text,
  signature text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.transactions enable row level security;

-- Create policies for transactions
create policy "Users can view their own transactions." on public.transactions for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can insert their own transactions." on public.transactions for insert with check (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can update their own transactions." on public.transactions for update using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone, nin, balance, public_key)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'nin',
    0.00,
    new.raw_user_meta_data->>'public_key'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function for Online Money Transfer
create or replace function transfer_funds(
  recipient_email text,
  amount numeric
) returns void as $$
declare
  sender_id uuid;
  recipient_id uuid;
  current_balance numeric;
begin
  sender_id := auth.uid();
  
  -- 1. Check if sender has enough balance
  select balance into current_balance from public.profiles where id = sender_id;
  if current_balance < amount then
    raise exception 'Insufficient funds';
  end if;

  -- 2. Get recipient ID
  select id into recipient_id from public.profiles where email = recipient_email;
  if recipient_id is null then
    raise exception 'Recipient not found';
  end if;

  -- 3. Update Sender
  update public.profiles set balance = balance - amount where id = sender_id;

  -- 4. Update Recipient
  update public.profiles set balance = balance + amount where id = recipient_id;

  -- 5. Record Single Transaction Record
  INSERT INTO public.transactions (id, sender_id, recipient_id, amount, type, status, title, created_at)
  VALUES (
    gen_random_uuid()::text, 
    sender_id, 
    recipient_id, 
    amount, -- Always store positive value, Store will determine sign
    'transfer', 
    'completed', 
    'Transfer to ' || recipient_email, 
    now()
  );

END;
$$ language plpgsql security definer;

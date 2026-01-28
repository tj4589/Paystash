-- REPAIR SCRIPT
-- 1. Create profiles for users who signed up before the tables existed
INSERT INTO public.profiles (id, email, full_name, balance)
SELECT id, email, raw_user_meta_data->>'full_name', 0.00
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2. Give everyone free money (Funding)
UPDATE public.profiles
SET balance = 2000.00;

-- 3. Show the result (You should see your email and 2000)
SELECT email, balance FROM public.profiles;

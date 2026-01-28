-- SIMPLIFIED VERSION
-- This will give ₦2,000 to EVERY user in your database.
-- Perfect for development/testing.

UPDATE public.profiles
SET balance = 2000.00;

-- Verify the results
SELECT email, balance FROM public.profiles;


-- Create a function to hash passwords in the database
CREATE OR REPLACE FUNCTION public.hash_password(pass text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(pass, gen_salt('bf'));
END;
$$;

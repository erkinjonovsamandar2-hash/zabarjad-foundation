-- Ensure quiz_config table + config column exist (idempotent)
CREATE TABLE IF NOT EXISTS public.quiz_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add config column if somehow missing (schema drift fix)
ALTER TABLE public.quiz_config ADD COLUMN IF NOT EXISTS config JSONB NOT NULL DEFAULT '{}';

-- SECURITY DEFINER upsert — bypasses RLS and auth.uid() timeout
-- Only admins should call this; function itself checks the role.
CREATE OR REPLACE FUNCTION public.upsert_quiz_config(config_data JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
  existing_id UUID;
BEGIN
  -- Admin check
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  -- Upsert: update if row exists, insert if not
  SELECT id INTO existing_id FROM quiz_config LIMIT 1;

  IF existing_id IS NOT NULL THEN
    UPDATE quiz_config
    SET config = config_data, updated_at = now()
    WHERE id = existing_id;
  ELSE
    INSERT INTO quiz_config (config) VALUES (config_data);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_quiz_config(JSONB) TO authenticated;

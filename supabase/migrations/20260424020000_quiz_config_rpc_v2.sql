-- Fix upsert_quiz_config: use COUNT instead of UUID variable
-- (production quiz_config may have integer id, not UUID)
CREATE OR REPLACE FUNCTION public.upsert_quiz_config(config_data JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
  row_count INTEGER;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT COUNT(*) INTO row_count FROM quiz_config;

  IF row_count > 0 THEN
    UPDATE quiz_config SET config = config_data, updated_at = now();
  ELSE
    INSERT INTO quiz_config (config) VALUES (config_data);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_quiz_config(JSONB) TO authenticated;

-- Admin user management RPCs
-- These SECURITY DEFINER functions let the client manage admins
-- without needing edge functions or service_role key exposure.
-- Each function verifies the caller is admin before acting.

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(id uuid, user_id uuid, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN RAISE EXCEPTION 'Access denied'; END IF;

  RETURN QUERY
  SELECT ur.id, ur.user_id, COALESCE(au.email, 'noma''lum')::text
  FROM user_roles ur
  LEFT JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin';
END; $$;

CREATE OR REPLACE FUNCTION public.lookup_user_by_email(p_email text)
RETURNS TABLE(found_user_id uuid, found_email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN RAISE EXCEPTION 'Access denied'; END IF;

  RETURN QUERY
  SELECT au.id, au.email::text FROM auth.users au WHERE au.email = p_email LIMIT 1;
END; $$;

CREATE OR REPLACE FUNCTION public.add_admin_user(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN RAISE EXCEPTION 'Access denied'; END IF;

  INSERT INTO user_roles (user_id, role) VALUES (p_user_id, 'admin')
  ON CONFLICT DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.remove_admin_user(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN RAISE EXCEPTION 'Access denied'; END IF;

  DELETE FROM user_roles WHERE id = p_id AND role = 'admin';
END; $$;

-- Grant execute to authenticated users (RPC is the only surface, functions guard themselves)
GRANT EXECUTE ON FUNCTION public.get_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.lookup_user_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin_user(uuid) TO authenticated;

-- quiz_config RLS: public read, admin write
ALTER TABLE quiz_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_config_public_read" ON quiz_config
FOR SELECT TO public USING (true);

CREATE POLICY "quiz_config_admin_write" ON quiz_config
FOR ALL TO authenticated
USING  (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

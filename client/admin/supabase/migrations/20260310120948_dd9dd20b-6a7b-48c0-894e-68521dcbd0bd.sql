
-- Allow authenticated users to insert their own admin role (for initial setup)
CREATE POLICY "Users can insert own role" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

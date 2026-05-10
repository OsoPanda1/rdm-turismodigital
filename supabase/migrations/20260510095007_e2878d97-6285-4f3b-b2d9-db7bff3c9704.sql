
-- 1. PROFILES: quitar exposición de email al público
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Owners and admins read full profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- Vista pública sin email para frontend
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, name, avatar_url, role, is_active, created_at
FROM public.profiles
WHERE is_active = true;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Política de lectura pública limitada en profiles (sin acceso a email para anon)
-- Solo permite ver columnas no sensibles vía la vista; tabla queda restringida a auth.

-- 2. FORUM POSTS: ocultar author_email del público
DROP POLICY IF EXISTS "Anyone can read approved posts" ON public.forum_posts;

CREATE POLICY "Authenticated read approved posts"
  ON public.forum_posts FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE OR REPLACE VIEW public.public_forum_posts
WITH (security_invoker = true) AS
SELECT id, title, content, video_url, image_url, place_name, category,
       likes, author_name, author_avatar, created_at, updated_at
FROM public.forum_posts
WHERE is_approved = true;

GRANT SELECT ON public.public_forum_posts TO anon, authenticated;

-- 3. FORUM COMMENTS: ocultar author_email del público
DROP POLICY IF EXISTS "Anyone can read comments" ON public.forum_comments;

CREATE POLICY "Authenticated read comments"
  ON public.forum_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE OR REPLACE VIEW public.public_forum_comments
WITH (security_invoker = true) AS
SELECT id, post_id, content, likes, author_name, created_at
FROM public.forum_comments;

GRANT SELECT ON public.public_forum_comments TO anon, authenticated;

-- 4. SYSTEM_LOGS: cerrar inserciones públicas
DROP POLICY IF EXISTS "Logs insert for all" ON public.system_logs;

CREATE POLICY "Authenticated users can write logs"
  ON public.system_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. REALTIME messages: requerir autenticación para suscripciones
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'realtime' AND c.relname = 'messages'
  ) THEN
    EXECUTE 'ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated can subscribe" ON realtime.messages';
    EXECUTE 'CREATE POLICY "Authenticated can subscribe" ON realtime.messages FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;

-- 6. SECURITY DEFINER functions: revocar EXECUTE público
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

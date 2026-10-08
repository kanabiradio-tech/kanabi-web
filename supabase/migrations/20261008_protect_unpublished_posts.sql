-- Apply through an authenticated database administrator. No post data is changed.
BEGIN;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.posts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.posts TO anon, authenticated;
CREATE POLICY public_posts_read ON public.posts AS PERMISSIVE FOR SELECT
TO anon, authenticated USING (status = 'published' AND published_at <= now());
-- Restrictive policy also constrains any pre-existing permissive SELECT/ALL policies.
CREATE POLICY public_posts_publication_guard ON public.posts AS RESTRICTIVE FOR SELECT
TO anon, authenticated USING (status = 'published' AND published_at <= now());
COMMIT;

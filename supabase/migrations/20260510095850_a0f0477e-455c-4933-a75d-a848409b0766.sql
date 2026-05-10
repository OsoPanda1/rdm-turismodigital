CREATE TABLE IF NOT EXISTS public.tamvcrums_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  ecg_rhythm numeric NOT NULL DEFAULT 0,
  impact_score numeric NOT NULL DEFAULT 0,
  emotional_state text NOT NULL DEFAULT 'neutral',
  federation_id text,
  source text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.tamvcrums_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read tamvcrums logs"
  ON public.tamvcrums_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins insert tamvcrums logs"
  ON public.tamvcrums_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete tamvcrums logs"
  ON public.tamvcrums_logs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_tamvcrums_logs_created_at ON public.tamvcrums_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_tamvcrums_logs_federation ON public.tamvcrums_logs(federation_id);
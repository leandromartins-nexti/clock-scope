CREATE TABLE public.score_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text NOT NULL DEFAULT 'qualidade_ponto' UNIQUE,
  weight_quality integer NOT NULL DEFAULT 70,
  weight_treatment integer NOT NULL DEFAULT 30,
  grade_under_1d integer NOT NULL DEFAULT 100,
  grade_1_3d integer NOT NULL DEFAULT 75,
  grade_3_7d integer NOT NULL DEFAULT 50,
  grade_7_15d integer NOT NULL DEFAULT 20,
  grade_over_15d integer NOT NULL DEFAULT 0,
  threshold_excellent integer NOT NULL DEFAULT 85,
  threshold_good integer NOT NULL DEFAULT 70,
  threshold_warning integer NOT NULL DEFAULT 55,
  threshold_poor integer NOT NULL DEFAULT 40,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.score_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to score_config"
ON public.score_config FOR ALL TO public
USING (true) WITH CHECK (true);

INSERT INTO public.score_config (config_key) VALUES ('qualidade_ponto');
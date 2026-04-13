CREATE TABLE public.absenteismo_score_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL DEFAULT 'absenteismo' UNIQUE,
  profile_type TEXT NOT NULL DEFAULT 'vigilancia',
  weight_absenteeism INTEGER NOT NULL DEFAULT 65,
  weight_turnover INTEGER NOT NULL DEFAULT 35,
  absenteeism_excellent_threshold NUMERIC NOT NULL DEFAULT 4,
  absenteeism_critical_threshold NUMERIC NOT NULL DEFAULT 20,
  turnover_excellent_threshold NUMERIC NOT NULL DEFAULT 24,
  turnover_critical_threshold NUMERIC NOT NULL DEFAULT 144,
  score_excellent INTEGER NOT NULL DEFAULT 85,
  score_good INTEGER NOT NULL DEFAULT 70,
  score_warning INTEGER NOT NULL DEFAULT 55,
  score_poor INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.absenteismo_score_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON public.absenteismo_score_config FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous update" ON public.absenteismo_score_config FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON public.absenteismo_score_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON public.absenteismo_score_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.absenteismo_score_config (config_key) VALUES ('absenteismo');
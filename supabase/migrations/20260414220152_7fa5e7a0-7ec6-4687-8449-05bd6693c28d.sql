
ALTER TABLE public.score_config
  ADD COLUMN IF NOT EXISTS weight_pressure integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS weight_backoffice integer NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS grade_pressure_under_1 integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS grade_pressure_1_2 integer NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS grade_pressure_2_4 integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS grade_pressure_4_6 integer NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS grade_pressure_over_6 integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grade_bo_under_400 integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS grade_bo_400_700 integer NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS grade_bo_700_1000 integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS grade_bo_1000_1400 integer NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS grade_bo_over_1400 integer NOT NULL DEFAULT 0;

UPDATE public.score_config
SET weight_quality = 45, weight_treatment = 20
WHERE config_key = 'qualidade_ponto'
  AND weight_quality = 70
  AND weight_treatment = 30;

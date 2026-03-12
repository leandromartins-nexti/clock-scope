
-- Improvements table
CREATE TABLE public.improvements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'cancelled')),
  position_x NUMERIC,
  position_y NUMERIC,
  position_route TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comments table
CREATE TABLE public.improvement_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  improvement_id UUID NOT NULL REFERENCES public.improvements(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'UI Team',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS - open access (no auth required, internal tool)
ALTER TABLE public.improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to improvements" ON public.improvements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to improvement_comments" ON public.improvement_comments FOR ALL USING (true) WITH CHECK (true);

-- Seed initial data
INSERT INTO public.improvements (id, title, description, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Traduzir variáveis de tipo de marcação', E'Transformar a variável em inglês em texto legível:\n• INVALID_TIME = Horário Inválido\n• NOT_REGISTERED = Esquecimento', 'pending', '2026-03-12'),
  ('00000000-0000-0000-0000-000000000002', 'Traduzir tipos de coletores', E'Rever as traduções dos tipos de coletores:\n• SYSTEM = Sistema\n• TERMINAL = Terminal\n• MOBILE = Dispositivo Móvel', 'pending', '2026-03-12'),
  ('00000000-0000-0000-0000-000000000003', 'Substituir ''% Total de Marcações por Tipo''', E'Este novo gráfico de barras empilhadas (Evolução % Marcações por Tipo) deve substituir o KPI estático ''% Total de Marcações por Tipo'' acima.\n\nAlém disso, deve possuir filtro cruzado com o ''Top 10 Pior Qualidade de Marcação'': ao clicar em uma empresa no ranking, o gráfico deve filtrar para exibir apenas os dados daquela empresa.', 'pending', '2026-03-12'),
  ('00000000-0000-0000-0000-000000000004', 'Substituir ''Total de Colaboradores por Coletor''', E'Este novo gráfico de barras empilhadas (Evolução Colaboradores por Coletor) deve substituir o KPI estático ''Total de Colaboradores por Coletor'' acima.\n\nDeve possuir filtro cruzado com o ''Top 10 Pior Qualidade de Marcação'': ao clicar em uma empresa no ranking, o gráfico deve filtrar para exibir apenas os dados daquela empresa.', 'pending', '2026-03-12');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.improvements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.improvement_comments;

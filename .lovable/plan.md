

# Persistir dados Orsegups (cliente 2) em JSON no código-fonte

## Problema
Os dados da Orsegups importados via ZIP ficam no `localStorage` do navegador. Ao limpar cache ou acessar de outro dispositivo/deploy, os gráficos aparecem vazios.

## Solução
Extrair os JSONs do ZIP `2_-_Orsegups.zip` e salvá-los em `src/data/customers/2/qualidade-ponto/`, seguindo exatamente a estrutura do cliente 642.

## Passos

### 1. Extrair ZIP e criar arquivos JSON
- Copiar o ZIP para `/tmp`
- Usar script Python com `zipfile` para extrair os JSONs
- Mapear os nomes de dimensão do ZIP (empresa, un-negocio, area) para os nomes de arquivo esperados pelo hook:
  - `headcount-por-empresa.json`, `headcount-por-un-negocio.json`, `headcount-por-area.json`
  - `tratativa-tempo-por-empresa.json`, `tratativa-tempo-por-un-negocio.json`, `tratativa-tempo-por-area.json`
  - `sobrecarga-por-empresa.json`, `sobrecarga-por-un-negocio.json`, `sobrecarga-por-area.json`
  - `decomposicao-score.json`, `kpis-periodo-anterior.json`
- Salvar em `src/data/customers/2/qualidade-ponto/`

### 2. Atualizar `src/data/customers-index.json`
- Confirmar que o cliente 2 já tem `"qualidade-ponto"` em `tabs_available` (já está)

### 3. Sem alteração de código
O sistema já carrega automaticamente via `import.meta.glob("/src/data/customers/*/qualidade-ponto/*.json")`. Basta os arquivos existirem no path correto.

## Resultado
Gráficos da Orsegups preenchidos em qualquer ambiente, sem depender de localStorage.


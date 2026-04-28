# 🏗️ Arquitetura do Sistema

## Camadas

### 1. Data Layer (Supabase)

Tabelas principais:
- `weight_logs` — histórico de peso corporal
- `meal_completions` — refeições completadas por dia
- `exercise_weights` — peso por exercício por data
- `posture_checklist` — checklist diário + nível de dor
- `supplement_weekly` — suplementos tomados por dia
- `ficha_completions` — treinos completados por dia
- `progress_photos` — fotos de progresso

---

### 2. Server Layer

- `src/app/*/page.tsx` — server components, busca dados no Supabase
- `src/app/api/*/route.ts` — API routes para mutations
- `src/lib/score.ts` — cálculos de score, streaks, check semanal

Responsável por:
- agregação de dados
- cálculo de score/streaks
- regras de negócio
- passagem de props para client components

---

### 3. Client Layer

- `src/components/**/*-client.tsx` — componentes interativos
- Recebem dados via props do server
- Gerenciam estado local (checkboxes, inputs, toggles)
- Chamam API routes para persistir mudanças

---

## Fluxo de dados

```
User action → Client component → API route → Supabase
Supabase → Server component (page.tsx) → Client component (props)
```

---

## Padrão safeQuery

Todas as queries no server usam wrapper `safeQuery<T>()` que retorna `[]` em caso de erro.
Evita 500 no dashboard quando qualquer tabela falha.

---

## Regra central

- Lógica SEMPRE no server
- UI só renderiza
- localStorage apenas como cache visual (não é fonte da verdade)

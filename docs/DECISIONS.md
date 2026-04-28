# 🧠 Decisões Arquiteturais

## D1 — exercise_weights (tabela separada)

**Escolha**: tabela nova `exercise_weights` em vez de reutilizar `workout_sets`  
**Motivo**: simplicidade + isolamento. workout_sets tem exercise_id como FK, exercise_weights usa nome direto — menos joins, mais rápido de implementar e consultar.

---

## D2 — meal_completions (Supabase, não localStorage)

**Escolha**: persistir refeições no Supabase  
**Motivo**: permite histórico, streaks e check semanal. localStorage perderia dados ao limpar cache.

---

## D3 — pain_level (coluna em posture_checklist)

**Escolha**: coluna adicional na tabela existente  
**Motivo**: centralização — dor faz parte do registro de postura do dia, não precisa de tabela separada.

---

## D4 — score/streaks (server-side)

**Escolha**: cálculo no server component (`page.tsx` + `score.ts`)  
**Motivo**: performance e consistência. Evita waterfall de fetches no client, sem estado de loading.

---

## D5 — localStorage (cache apenas)

**Escolha**: localStorage para cache visual de pesos de exercício  
**Motivo**: UX rápida — mostra último peso imediatamente sem esperar fetch. Supabase é fonte da verdade.

---

## D6 — fotos (sem limite de registros)

**Escolha**: buscar todas as fotos sem `.limit()`  
**Motivo**: sistema pessoal com volume baixo. Simplicidade > otimização prematura.

---

## D7 — single user (sem autenticação)

**Escolha**: sem auth, sem user_id nas tabelas  
**Motivo**: uso pessoal exclusivo. Adicionar auth seria overhead sem benefício.

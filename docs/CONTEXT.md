# 📋 CONTEXT.md — Contexto do Projeto

## Objetivo

Sistema pessoal de performance física para acompanhamento de:
- Ganho de peso (meta: 58kg → 70kg)
- Consistência alimentar (6 refeições/dia)
- Evolução de treino (pesos por exercício)
- Postura (checklist diário + nível de dor)
- Acompanhamento visual (fotos de progresso)

## Stack

- **Framework**: Next.js 16 (App Router)
- **Banco**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Deploy**: Vercel
- **Linguagem**: TypeScript strict

## Usuário

Single user. Sem autenticação. Sem multi-tenant.

## Estado atual

Todas as features do sistema base estão implementadas e em produção:
- Dashboard com score, streaks, check semanal, alertas
- Alimentação com 6 refeições hardcoded + progresso diário
- Treinos com histórico de peso por exercício + PR
- Postura com nível de dor 0-10 + média semanal
- Fotos com timeline e comparação antes/depois
- Suplementos (creatina, whey, hipercalórico)

## Repositório

`https://github.com/Vitorvexia/workout`

## Supabase

Projeto: `yyvvdtaopyizywtiyvbs`

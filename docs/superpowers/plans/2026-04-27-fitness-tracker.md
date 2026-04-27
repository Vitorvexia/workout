# Fitness Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal physical evolution dashboard with weight tracking, workout logging, progress photos, posture checks, and supplement tracking — using Next.js + Supabase.

**Architecture:** Next.js App Router with React Server Components for data fetching, Supabase for database and storage, Tailwind CSS + shadcn/ui for dark-mode UI. No authentication required (single-user local access). API routes handle mutations, RSC handles reads.

**Tech Stack:** Next.js 14 (App Router), Supabase JS client, Tailwind CSS, shadcn/ui, Recharts (charts), date-fns, TypeScript.

---

## File Structure

```
workout/
├── app/
│   ├── layout.tsx                    # Root layout, dark theme
│   ├── page.tsx                      # Dashboard (peso + meta + gráfico)
│   ├── globals.css                   # Tailwind base
│   ├── treinos/
│   │   └── page.tsx                  # Workout page
│   ├── fotos/
│   │   └── page.tsx                  # Progress photos page
│   ├── postura/
│   │   └── page.tsx                  # Posture log page
│   ├── suplementos/
│   │   └── page.tsx                  # Supplement log page
│   └── api/
│       ├── peso/route.ts             # POST weight log
│       ├── treinos/route.ts          # POST workout log
│       ├── exercicios/route.ts       # GET/POST exercises
│       ├── fotos/route.ts            # POST photo upload
│       ├── postura/route.ts          # POST posture log
│       └── suplementos/route.ts     # POST supplement log
├── components/
│   ├── nav.tsx                       # Sidebar navigation
│   ├── dashboard/
│   │   ├── weight-card.tsx           # Current weight + meta card
│   │   ├── weight-chart.tsx          # Recharts line chart
│   │   └── weekly-status.tsx        # Weekly summary card
│   ├── treinos/
│   │   ├── exercise-form.tsx         # Add exercise set form
│   │   ├── exercise-history.tsx      # History per exercise
│   │   └── exercise-list.tsx        # Exercise selector
│   ├── fotos/
│   │   ├── photo-upload.tsx          # Upload form (frente/lado/costas)
│   │   └── photo-comparison.tsx     # Side-by-side comparison
│   ├── postura/
│   │   └── posture-form.tsx          # Daily posture checklist
│   └── suplementos/
│       └── supplement-form.tsx      # Daily supplement checklist
├── lib/
│   ├── supabase.ts                   # Supabase client
│   └── types.ts                      # Shared TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial.sql           # All table definitions
├── .env.local.example                # Env var template
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

### Task 1: Project Bootstrap + Supabase Schema

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `.env.local.example`
- Create: `supabase/migrations/001_initial.sql`
- Create: `lib/supabase.ts`
- Create: `lib/types.ts`
- Create: `app/globals.css`

- [ ] **Step 1: Inicializar projeto Next.js**

```bash
cd "C:\Users\vitor\OneDrive\Área de Trabalho\workout"
npx create-next-app@latest . --typescript --tailwind --app --src-dir no --import-alias "@/*" --no-git
```

Expected: scaffolded Next.js project in current dir.

- [ ] **Step 2: Instalar dependências**

```bash
npm install @supabase/supabase-js recharts date-fns
npx shadcn@latest init --defaults
npx shadcn@latest add button card input label select textarea badge separator progress
```

Expected: node_modules populated, `components/ui/` created.

- [ ] **Step 3: Criar template de variáveis de ambiente**

Criar `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Copiar como `.env.local` e preencher com credenciais reais do Supabase.

- [ ] **Step 4: Criar cliente Supabase**

Criar `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 5: Criar tipos TypeScript**

Criar `lib/types.ts`:

```typescript
export type WeightLog = {
  id: string
  weight_kg: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type Exercise = {
  id: string
  name: string
  muscle_group: string | null
  created_at: string
}

export type WorkoutSet = {
  id: string
  exercise_id: string
  exercise?: Exercise
  weight_kg: number
  reps: number
  sets: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type ProgressPhoto = {
  id: string
  angle: 'frente' | 'lado' | 'costas'
  photo_url: string
  taken_at: string
  created_at: string
}

export type PostureLog = {
  id: string
  did_exercises: boolean
  back_pain_level: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type SupplementLog = {
  id: string
  took_hypercaloric: boolean
  took_whey: boolean
  took_creatine: boolean
  logged_at: string
  created_at: string
}
```

- [ ] **Step 6: Criar migração SQL**

Criar `supabase/migrations/001_initial.sql`:

```sql
-- Weight logs
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  weight_kg numeric(5,2) not null,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Exercises catalog
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  muscle_group text,
  created_at timestamptz default now()
);

-- Workout sets
create table if not exists workout_sets (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  reps integer not null,
  sets integer not null default 1,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Progress photos
create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  angle text not null check (angle in ('frente', 'lado', 'costas')),
  photo_url text not null,
  taken_at date not null default current_date,
  created_at timestamptz default now()
);

-- Posture logs
create table if not exists posture_logs (
  id uuid primary key default gen_random_uuid(),
  did_exercises boolean not null default false,
  back_pain_level integer not null check (back_pain_level between 0 and 10),
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Supplement logs
create table if not exists supplement_logs (
  id uuid primary key default gen_random_uuid(),
  took_hypercaloric boolean not null default false,
  took_whey boolean not null default false,
  took_creatine boolean not null default false,
  logged_at date not null default current_date,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_weight_logs_date on weight_logs(logged_at desc);
create index if not exists idx_workout_sets_exercise on workout_sets(exercise_id, logged_at desc);
create index if not exists idx_progress_photos_date on progress_photos(taken_at desc);
create index if not exists idx_posture_logs_date on posture_logs(logged_at desc);
create index if not exists idx_supplement_logs_date on supplement_logs(logged_at desc);

-- Seed exercises
insert into exercises (name, muscle_group) values
  ('Supino Reto', 'Peito'),
  ('Supino Inclinado', 'Peito'),
  ('Crucifixo', 'Peito'),
  ('Puxada Frente', 'Costas'),
  ('Remada Curvada', 'Costas'),
  ('Agachamento', 'Pernas'),
  ('Leg Press', 'Pernas'),
  ('Rosca Direta', 'Bíceps'),
  ('Tríceps Pulley', 'Tríceps'),
  ('Desenvolvimento', 'Ombros'),
  ('Elevação Lateral', 'Ombros')
on conflict (name) do nothing;
```

- [ ] **Step 7: Executar migração no Supabase**

No painel do Supabase → SQL Editor → colar e executar conteúdo de `supabase/migrations/001_initial.sql`.

Criar bucket no Storage: `progress-photos` com política pública de leitura.

- [ ] **Step 8: Configurar next.config.js para imagens do Supabase**

Editar `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
```

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: project bootstrap + supabase schema"
```

---

### Task 2: Layout + Navegação

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/nav.tsx`

- [ ] **Step 1: Criar globals.css com tema dark**

Substituir `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 7%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 3px; }
```

- [ ] **Step 2: Criar navegação lateral**

Criar `components/nav.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Camera, Dumbbell, Activity, Pill } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/treinos', label: 'Treinos', icon: Dumbbell },
  { href: '/fotos', label: 'Fotos', icon: Camera },
  { href: '/postura', label: 'Postura', icon: Activity },
  { href: '/suplementos', label: 'Suplementos', icon: Pill },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-border bg-card flex flex-col py-6 px-3 z-50">
      <div className="px-3 mb-8">
        <h1 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Workout
        </h1>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-accent text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 3: Criar root layout**

Substituir `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Workout Tracker',
  description: 'Acompanhamento de evolução física',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <Nav />
        <main className="ml-56 min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Instalar lucide-react**

```bash
npm install lucide-react
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: layout + sidebar navigation"
```

---

### Task 3: Dashboard — Peso e Gráfico

**Files:**
- Create: `app/page.tsx`
- Create: `app/api/peso/route.ts`
- Create: `components/dashboard/weight-card.tsx`
- Create: `components/dashboard/weight-chart.tsx`
- Create: `components/dashboard/weekly-status.tsx`

- [ ] **Step 1: Criar API route para peso**

Criar `app/api/peso/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { weight_kg, notes, logged_at } = body

  if (!weight_kg || isNaN(Number(weight_kg))) {
    return NextResponse.json({ error: 'Peso inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('weight_logs')
    .insert({ weight_kg: Number(weight_kg), notes, logged_at })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .order('logged_at', { ascending: true })
    .limit(60)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 2: Criar card de peso atual**

Criar `components/dashboard/weight-card.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WeightLog } from '@/lib/types'

const INITIAL_WEIGHT = 58
const TARGET_WEIGHT = 68
const TARGET_DATE = '2026-06-27'

type Props = {
  latest: WeightLog | null
  onAdded: () => void
}

export function WeightCard({ latest, onAdded }: Props) {
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)

  const current = latest?.weight_kg ?? INITIAL_WEIGHT
  const gained = current - INITIAL_WEIGHT
  const remaining = TARGET_WEIGHT - current
  const progress = Math.min(100, (gained / (TARGET_WEIGHT - INITIAL_WEIGHT)) * 100)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!weight) return
    setLoading(true)
    await fetch('/api/peso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight_kg: parseFloat(weight) }),
    })
    setWeight('')
    setLoading(false)
    onAdded()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Peso Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">{current}</span>
          <span className="text-xl text-muted-foreground mb-1">kg</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Meta: {TARGET_WEIGHT}kg</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>+{gained.toFixed(1)}kg ganhos</span>
            <span>{remaining.toFixed(1)}kg restantes</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="number"
            step="0.1"
            placeholder="Registrar peso"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? '...' : 'Salvar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Criar gráfico de evolução**

Criar `components/dashboard/weight-chart.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { WeightLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { logs: WeightLog[] }

export function WeightChart({ logs }: Props) {
  const data = logs.map((l) => ({
    date: format(parseISO(l.logged_at), 'dd/MM', { locale: ptBR }),
    peso: Number(l.weight_kg),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Evolução de Peso
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum registro ainda
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <ReferenceLine
                y={68}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                label={{ value: 'Meta', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--foreground))', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Criar card de status semanal**

Criar `components/dashboard/weekly-status.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { startOfWeek, format } from 'date-fns'

export async function WeeklyStatus() {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const [{ count: supplementDays }, { count: postureDays }, { count: workoutDays }] =
    await Promise.all([
      supabase
        .from('supplement_logs')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
      supabase
        .from('posture_logs')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
      supabase
        .from('workout_sets')
        .select('logged_at', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
    ])

  const items = [
    { label: 'Dias de suplemento', value: supplementDays ?? 0, max: 7 },
    { label: 'Dias de postura', value: postureDays ?? 0, max: 7 },
    { label: 'Treinos', value: workoutDays ?? 0, max: 5 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Esta semana
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}/{item.max}</span>
            </div>
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full"
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5: Criar página dashboard**

Criar `app/page.tsx`:

```tsx
import { WeightChart } from '@/components/dashboard/weight-chart'
import { WeightCard } from '@/components/dashboard/weight-card'
import { WeeklyStatus } from '@/components/dashboard/weekly-status'
import { supabase } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const revalidate = 0

export default async function DashboardPage() {
  const { data: weightLogs } = await supabase
    .from('weight_logs')
    .select('*')
    .order('logged_at', { ascending: true })
    .limit(60)

  const logs = weightLogs ?? []
  const latest = logs.at(-1) ?? null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhamento de evolução física
        </p>
      </div>

      <DashboardClient latest={latest} logs={logs} />

      <WeeklyStatus />
    </div>
  )
}
```

- [ ] **Step 6: Criar DashboardClient para interatividade**

Criar `components/dashboard/dashboard-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { WeightCard } from './weight-card'
import { WeightChart } from './weight-chart'
import { WeightLog } from '@/lib/types'

type Props = {
  latest: WeightLog | null
  logs: WeightLog[]
}

export function DashboardClient({ latest: initialLatest, logs: initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)
  const latest = logs.at(-1) ?? initialLatest

  async function refresh() {
    const res = await fetch('/api/peso')
    const data = await res.json()
    setLogs(data)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <WeightCard latest={latest} onAdded={refresh} />
      <div className="lg:col-span-2">
        <WeightChart logs={logs} />
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Instalar date-fns locale**

```bash
npm install date-fns
```

- [ ] **Step 8: Testar dashboard**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Verificar: card de peso aparece, formulário de registro funciona, gráfico renderiza após registros.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: dashboard with weight tracking and chart"
```

---

### Task 4: Treinos

**Files:**
- Create: `app/treinos/page.tsx`
- Create: `app/api/treinos/route.ts`
- Create: `app/api/exercicios/route.ts`
- Create: `components/treinos/exercise-form.tsx`
- Create: `components/treinos/exercise-history.tsx`

- [ ] **Step 1: Criar API de exercícios**

Criar `app/api/exercicios/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { name, muscle_group } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const { data, error } = await supabase
    .from('exercises')
    .insert({ name, muscle_group })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
```

- [ ] **Step 2: Criar API de treinos**

Criar `app/api/treinos/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { exercise_id, weight_kg, reps, sets, notes, logged_at } = body

  if (!exercise_id || !weight_kg || !reps) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('workout_sets')
    .insert({ exercise_id, weight_kg: Number(weight_kg), reps: Number(reps), sets: Number(sets ?? 1), notes, logged_at })
    .select('*, exercise:exercises(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const exercise_id = searchParams.get('exercise_id')

  let query = supabase
    .from('workout_sets')
    .select('*, exercise:exercises(*)')
    .order('logged_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (exercise_id) query = query.eq('exercise_id', exercise_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 3: Criar formulário de treino**

Criar `components/treinos/exercise-form.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Exercise, WorkoutSet } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  onLogged: (set: WorkoutSet) => void
}

export function ExerciseForm({ exercises, onLogged }: Props) {
  const [exerciseId, setExerciseId] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('3')
  const [lastWeight, setLastWeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!exerciseId) return
    fetch(`/api/treinos?exercise_id=${exerciseId}`)
      .then((r) => r.json())
      .then((data: WorkoutSet[]) => {
        if (data.length > 0) setLastWeight(data[0].weight_kg)
        else setLastWeight(null)
      })
  }, [exerciseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!exerciseId || !weight || !reps) return
    setLoading(true)
    const res = await fetch('/api/treinos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exercise_id: exerciseId,
        weight_kg: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) onLogged(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registrar Série
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Exercício</Label>
            <Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar exercício" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id}>
                    {ex.name}
                    {ex.muscle_group && (
                      <span className="text-muted-foreground ml-1">· {ex.muscle_group}</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lastWeight !== null && (
              <p className="text-xs text-muted-foreground">
                Último peso: <span className="text-foreground font-medium">{lastWeight}kg</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Peso (kg)</Label>
              <Input
                type="number"
                step="0.5"
                placeholder="60"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reps</Label>
              <Input
                type="number"
                placeholder="12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Séries</Label>
              <Input
                type="number"
                placeholder="3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Criar histórico de exercícios**

Criar `components/treinos/exercise-history.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkoutSet } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

type Props = { sets: WorkoutSet[] }

export function ExerciseHistory({ sets }: Props) {
  const grouped = sets.reduce<Record<string, WorkoutSet[]>>((acc, s) => {
    const key = s.exercise?.name ?? s.exercise_id
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum registro ainda
          </p>
        )}
        {Object.entries(grouped).map(([name, items]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{name}</span>
              {items[0].exercise?.muscle_group && (
                <Badge variant="secondary" className="text-xs">
                  {items[0].exercise.muscle_group}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {items.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {format(parseISO(s.logged_at), "dd 'de' MMM", { locale: ptBR })}
                  </span>
                  <span className="font-mono text-xs">
                    {s.sets}×{s.reps} @ {s.weight_kg}kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5: Criar página de treinos**

Criar `app/treinos/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { ExerciseHistory } from '@/components/treinos/exercise-history'
import { TreinosClient } from '@/components/treinos/treinos-client'

export const revalidate = 0

export default async function TreinosPage() {
  const [{ data: exercises }, { data: recentSets }] = await Promise.all([
    supabase.from('exercises').select('*').order('name'),
    supabase
      .from('workout_sets')
      .select('*, exercise:exercises(*)')
      .order('logged_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Treinos</h1>
        <p className="text-sm text-muted-foreground mt-1">Registre séries e acompanhe evolução de carga</p>
      </div>
      <TreinosClient exercises={exercises ?? []} initialSets={recentSets ?? []} />
    </div>
  )
}
```

- [ ] **Step 6: Criar TreinosClient**

Criar `components/treinos/treinos-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { ExerciseForm } from './exercise-form'
import { ExerciseHistory } from './exercise-history'
import { Exercise, WorkoutSet } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  initialSets: WorkoutSet[]
}

export function TreinosClient({ exercises, initialSets }: Props) {
  const [sets, setSets] = useState(initialSets)

  function handleLogged(newSet: WorkoutSet) {
    setSets((prev) => [newSet, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ExerciseForm exercises={exercises} onLogged={handleLogged} />
      <ExerciseHistory sets={sets} />
    </div>
  )
}
```

- [ ] **Step 7: Testar treinos**

Navegar para `/treinos`. Verificar: select de exercícios funciona, último peso aparece, registro salva e aparece no histórico.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: workout logging with exercise history"
```

---

### Task 5: Upload de Fotos

**Files:**
- Create: `app/fotos/page.tsx`
- Create: `app/api/fotos/route.ts`
- Create: `components/fotos/photo-upload.tsx`
- Create: `components/fotos/photo-comparison.tsx`

- [ ] **Step 1: Criar API de fotos**

Criar `app/api/fotos/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const angle = formData.get('angle') as string
  const taken_at = formData.get('taken_at') as string

  if (!file || !angle) {
    return NextResponse.json({ error: 'Arquivo e ângulo obrigatórios' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `${angle}-${taken_at ?? new Date().toISOString().split('T')[0]}-${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filename, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('progress-photos').getPublicUrl(filename)

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({ angle, photo_url: urlData.publicUrl, taken_at: taken_at ?? new Date().toISOString().split('T')[0] })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .order('taken_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 2: Criar formulário de upload**

Criar `components/fotos/photo-upload.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressPhoto } from '@/lib/types'

type Props = { onUploaded: (photo: ProgressPhoto) => void }

export function PhotoUpload({ onUploaded }: Props) {
  const [angle, setAngle] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !angle) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('angle', angle)
    fd.append('taken_at', new Date().toISOString().split('T')[0])
    const res = await fetch('/api/fotos', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onUploaded(data)
      setFile(null)
      setPreview(null)
      setAngle('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Adicionar Foto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Ângulo</Label>
            <Select value={angle} onValueChange={setAngle}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar ângulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frente">Frente</SelectItem>
                <SelectItem value="lado">Lado</SelectItem>
                <SelectItem value="costas">Costas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Foto</Label>
            <label className="block border border-border border-dashed rounded-md p-6 cursor-pointer hover:border-muted-foreground transition-colors text-center">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {preview ? (
                <img src={preview} alt="preview" className="max-h-40 mx-auto rounded object-cover" />
              ) : (
                <span className="text-sm text-muted-foreground">Clique para selecionar</span>
              )}
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !file || !angle}>
            {loading ? 'Enviando...' : 'Fazer Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Criar comparação de fotos**

Criar `components/fotos/photo-comparison.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressPhoto } from '@/lib/types'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { photos: ProgressPhoto[] }

const ANGLES = ['frente', 'lado', 'costas'] as const

export function PhotoComparison({ photos: initialPhotos }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedAngle, setSelectedAngle] = useState<string>('frente')

  const filtered = photos.filter((p) => p.angle === selectedAngle)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Comparação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {ANGLES.map((a) => (
            <Button
              key={a}
              size="sm"
              variant={selectedAngle === a ? 'default' : 'outline'}
              onClick={() => setSelectedAngle(a)}
              className="capitalize text-xs"
            >
              {a}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma foto de {selectedAngle} ainda
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.slice(0, 4).map((photo) => (
              <div key={photo.id} className="space-y-1">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-secondary">
                  <Image
                    src={photo.photo_url}
                    alt={`${photo.angle} ${photo.taken_at}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {format(parseISO(photo.taken_at), "dd MMM yyyy", { locale: ptBR })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Criar página de fotos**

Criar `app/fotos/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { FotosClient } from '@/components/fotos/fotos-client'

export const revalidate = 0

export default async function FotosPage() {
  const { data: photos } = await supabase
    .from('progress_photos')
    .select('*')
    .order('taken_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fotos</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe sua evolução visual</p>
      </div>
      <FotosClient initialPhotos={photos ?? []} />
    </div>
  )
}
```

- [ ] **Step 5: Criar FotosClient**

Criar `components/fotos/fotos-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { PhotoUpload } from './photo-upload'
import { PhotoComparison } from './photo-comparison'
import { ProgressPhoto } from '@/lib/types'

type Props = { initialPhotos: ProgressPhoto[] }

export function FotosClient({ initialPhotos }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)

  function handleUploaded(photo: ProgressPhoto) {
    setPhotos((prev) => [photo, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PhotoUpload onUploaded={handleUploaded} />
      <PhotoComparison photos={photos} />
    </div>
  )
}
```

- [ ] **Step 6: Testar fotos**

Navegar para `/fotos`. Verificar: upload funciona, foto aparece na comparação, filtro por ângulo funciona.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: progress photo upload and comparison"
```

---

### Task 6: Postura

**Files:**
- Create: `app/postura/page.tsx`
- Create: `app/api/postura/route.ts`
- Create: `components/postura/posture-form.tsx`

- [ ] **Step 1: Criar API de postura**

Criar `app/api/postura/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { did_exercises, back_pain_level, notes, logged_at } = body

  if (back_pain_level === undefined || back_pain_level < 0 || back_pain_level > 10) {
    return NextResponse.json({ error: 'Nível de dor deve ser entre 0 e 10' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('posture_logs')
    .insert({ did_exercises: Boolean(did_exercises), back_pain_level: Number(back_pain_level), notes, logged_at })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('posture_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 2: Criar formulário de postura**

Criar `components/postura/posture-form.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PostureLog } from '@/lib/types'

type Props = { onLogged: (log: PostureLog) => void }

export function PostureForm({ onLogged }: Props) {
  const [didExercises, setDidExercises] = useState(false)
  const [painLevel, setPainLevel] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/postura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        did_exercises: didExercises,
        back_pain_level: painLevel,
        notes,
        logged_at: new Date().toISOString().split('T')[0],
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onLogged(data)
      setNotes('')
    }
  }

  const painColors: Record<number, string> = {
    0: 'text-green-400', 1: 'text-green-400', 2: 'text-green-400',
    3: 'text-yellow-400', 4: 'text-yellow-400', 5: 'text-yellow-400',
    6: 'text-orange-400', 7: 'text-orange-400',
    8: 'text-red-400', 9: 'text-red-400', 10: 'text-red-400',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registro Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setDidExercises(!didExercises)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                didExercises ? 'bg-foreground border-foreground' : 'border-border'
              }`}
            >
              {didExercises && (
                <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm">Fiz exercícios posturais</span>
          </label>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Dor na coluna</Label>
              <span className={`text-lg font-bold ${painColors[painLevel]}`}>
                {painLevel}/10
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-foreground"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sem dor</span>
              <span>Dor intensa</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Criar página de postura**

Criar `app/postura/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { PostureClient } from '@/components/postura/posture-client'

export const revalidate = 0

export default async function PosturaPage() {
  const { data: logs } = await supabase
    .from('posture_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Postura</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe sua rotina postural diária</p>
      </div>
      <PostureClient initialLogs={logs ?? []} />
    </div>
  )
}
```

- [ ] **Step 4: Criar PostureClient**

Criar `components/postura/posture-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { PostureForm } from './posture-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostureLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { initialLogs: PostureLog[] }

export function PostureClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)

  function handleLogged(log: PostureLog) {
    setLogs((prev) => [log, ...prev])
  }

  const painColor = (level: number) => {
    if (level <= 2) return 'text-green-400'
    if (level <= 5) return 'text-yellow-400'
    if (level <= 7) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PostureForm onLogged={handleLogged} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum registro ainda</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(log.logged_at), "dd MMM", { locale: ptBR })}
                    </span>
                    {log.did_exercises && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">Exercícios ✓</span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${painColor(log.back_pain_level)}`}>
                    Dor: {log.back_pain_level}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: posture daily log with history"
```

---

### Task 7: Suplementação

**Files:**
- Create: `app/suplementos/page.tsx`
- Create: `app/api/suplementos/route.ts`
- Create: `components/suplementos/supplement-form.tsx`
- Create: `components/suplementos/supplement-client.tsx`

- [ ] **Step 1: Criar API de suplementos**

Criar `app/api/suplementos/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { took_hypercaloric, took_whey, took_creatine, logged_at } = body

  const { data, error } = await supabase
    .from('supplement_logs')
    .insert({
      took_hypercaloric: Boolean(took_hypercaloric),
      took_whey: Boolean(took_whey),
      took_creatine: Boolean(took_creatine),
      logged_at: logged_at ?? new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

- [ ] **Step 2: Criar formulário de suplementos**

Criar `components/suplementos/supplement-form.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SupplementLog } from '@/lib/types'

type Supplement = {
  key: keyof Pick<SupplementLog, 'took_hypercaloric' | 'took_whey' | 'took_creatine'>
  label: string
  description: string
}

const SUPPLEMENTS: Supplement[] = [
  { key: 'took_hypercaloric', label: 'Hipercalórico', description: 'Ganho de massa' },
  { key: 'took_whey', label: 'Whey Protein', description: 'Recuperação muscular' },
  { key: 'took_creatine', label: 'Creatina', description: 'Força e performance' },
]

type Props = { onLogged: (log: SupplementLog) => void }

export function SupplementForm({ onLogged }: Props) {
  const [checked, setChecked] = useState({
    took_hypercaloric: false,
    took_whey: false,
    took_creatine: false,
  })
  const [loading, setLoading] = useState(false)

  function toggle(key: keyof typeof checked) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/suplementos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...checked,
        logged_at: new Date().toISOString().split('T')[0],
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onLogged(data)
      setChecked({ took_hypercaloric: false, took_whey: false, took_creatine: false })
    }
  }

  const total = Object.values(checked).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registro Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {SUPPLEMENTS.map(({ key, label, description }) => (
            <label
              key={key}
              className="flex items-center gap-4 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <div
                onClick={(e) => { e.preventDefault(); toggle(key) }}
                className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  checked[key] ? 'bg-foreground border-foreground' : 'border-border'
                }`}
              >
                {checked[key] && (
                  <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </label>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">{total}/3 tomados hoje</span>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Criar página de suplementos**

Criar `app/suplementos/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { SupplementClient } from '@/components/suplementos/supplement-client'

export const revalidate = 0

export default async function SupplementosPage() {
  const { data: logs } = await supabase
    .from('supplement_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Suplementação</h1>
        <p className="text-sm text-muted-foreground mt-1">Registre seus suplementos diários</p>
      </div>
      <SupplementClient initialLogs={logs ?? []} />
    </div>
  )
}
```

- [ ] **Step 4: Criar SupplementClient**

Criar `components/suplementos/supplement-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { SupplementForm } from './supplement-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupplementLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { initialLogs: SupplementLog[] }

const LABELS = {
  took_hypercaloric: 'Hipercal',
  took_whey: 'Whey',
  took_creatine: 'Creatina',
} as const

export function SupplementClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)

  function handleLogged(log: SupplementLog) {
    setLogs((prev) => [log, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SupplementForm onLogged={handleLogged} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum registro ainda</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 20).map((log) => {
                const taken = (Object.entries(LABELS) as [keyof typeof LABELS, string][])
                  .filter(([key]) => log[key])
                  .map(([, label]) => label)
                const total = taken.length

                return (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(log.logged_at), "dd MMM", { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2">
                      {taken.map((label) => (
                        <span key={label} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                          {label}
                        </span>
                      ))}
                      <span className={`text-xs font-medium ${total === 3 ? 'text-green-400' : total === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {total}/3
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Testar suplementos**

Navegar para `/suplementos`. Verificar: checkboxes funcionam, registro salva, histórico mostra badges corretos.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: supplement daily tracking with history"
```

---

### Task 8: Configuração Final + Deploy

**Files:**
- Create: `.env.local.example`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Configurar Supabase Storage CORS**

No painel Supabase → Storage → `progress-photos` bucket → Policies:
- Adicionar policy `INSERT` pública (ou autenticada se preferir)
- Adicionar policy `SELECT` pública

SQL para policies públicas:
```sql
-- Leitura pública
create policy "Public read" on storage.objects
  for select using (bucket_id = 'progress-photos');

-- Upload público (single-user app)
create policy "Public upload" on storage.objects
  for insert with check (bucket_id = 'progress-photos');
```

- [ ] **Step 2: Verificar build sem erros**

```bash
npm run build
```

Expected: build completes without TypeScript or lint errors.

- [ ] **Step 3: Testar fluxo completo**

```bash
npm run dev
```

Checklist manual:
- [ ] Dashboard carrega com card de peso e gráfico
- [ ] Registrar peso → gráfico atualiza
- [ ] Treinos → selecionar exercício → ver último peso → registrar → aparece no histórico
- [ ] Fotos → upload frente/lado/costas → aparece na comparação
- [ ] Postura → marcar exercícios + dor → aparece no histórico
- [ ] Suplementos → marcar 3 itens → registrar → badges corretos no histórico
- [ ] Status semanal no dashboard reflete registros

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: complete fitness tracker - weight, workouts, photos, posture, supplements"
```

---

## Setup Rápido (para executar do zero)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.local.example .env.local
# Editar .env.local com URL e chave do Supabase

# 3. Executar migração SQL no painel do Supabase

# 4. Criar bucket 'progress-photos' no Supabase Storage

# 5. Rodar em dev
npm run dev
```

---

## Notas de Implementação

- `revalidate = 0` em todas as pages — sem cache, sempre dados frescos
- Dashboard usa padrão RSC + Client Component para hidratação: server busca dados, client component gerencia state após mutations
- Fotos armazenadas no Supabase Storage, URL pública salva no banco — sem processamento server-side de imagem
- `date-fns/locale/ptBR` para formatação de datas em português
- Peso inicial hardcoded como `58kg`, meta `68kg` em `weight-card.tsx:8-9` — ajustar conforme necessário

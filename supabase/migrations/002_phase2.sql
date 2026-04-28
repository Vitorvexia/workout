-- Update exercises: delete old seeds, insert categorized exercises
delete from workout_sets;
delete from exercises;

insert into exercises (name, muscle_group) values
  -- Peito
  ('Supino Inclinado', 'Peito'),
  ('Supino Declinado', 'Peito'),
  ('Crucifixo', 'Peito'),
  -- Costas
  ('Pulley Frente', 'Costas'),
  ('Remada Unilateral', 'Costas'),
  ('Remada Baixa no Triângulo', 'Costas'),
  -- Bíceps
  ('Rosca Direta (Barra)', 'Bíceps'),
  ('Rosca Scott', 'Bíceps'),
  ('Rosca 45 Graus', 'Bíceps'),
  -- Tríceps
  ('Extensão de Tríceps no Cabo', 'Tríceps'),
  ('Tríceps Pulley', 'Tríceps'),
  ('Tríceps Testa', 'Tríceps'),
  -- Perna
  ('Agachamento Livre', 'Perna'),
  ('Leg Press 45', 'Perna'),
  ('Cadeira Extensora', 'Perna'),
  ('Stiff', 'Perna'),
  ('Mesa Flexora', 'Perna'),
  -- Ombro
  ('Desenvolvimento', 'Ombro'),
  ('Elevação Lateral', 'Ombro'),
  ('Elevação Frontal', 'Ombro'),
  -- Abs
  ('Abdominal Crunch', 'Abs'),
  ('Prancha', 'Abs')
on conflict (name) do nothing;

-- Ficha de treino completions
create table if not exists ficha_completions (
  id uuid primary key default gen_random_uuid(),
  day_letter text not null check (day_letter in ('A','B','C','D','E')),
  exercise_name text not null,
  completed_at date not null default current_date,
  created_at timestamptz default now()
);
create index if not exists idx_ficha_completions_date on ficha_completions(completed_at desc);

-- Posture checklist (daily, 5 exercises)
create table if not exists posture_checklist (
  id uuid primary key default gen_random_uuid(),
  logged_at date not null default current_date,
  exercise_1 boolean not null default false,
  exercise_2 boolean not null default false,
  exercise_3 boolean not null default false,
  exercise_4 boolean not null default false,
  exercise_5 boolean not null default false,
  created_at timestamptz default now(),
  unique(logged_at)
);

-- Supplement weekly logs (count-based for hipercalórico)
create table if not exists supplement_weekly (
  id uuid primary key default gen_random_uuid(),
  logged_at date not null,
  supplement text not null check (supplement in ('creatina','whey','hipercalorico')),
  count integer not null default 1,
  created_at timestamptz default now(),
  unique(logged_at, supplement)
);
create index if not exists idx_supplement_weekly_date on supplement_weekly(logged_at desc);

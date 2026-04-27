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

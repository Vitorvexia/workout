-- exercise_weights: per-exercise, per-date weight tracking
create table if not exists exercise_weights (
  id uuid primary key default gen_random_uuid(),
  exercise_name text not null,
  logged_at date not null default current_date,
  weight_kg numeric(5,2) not null,
  created_at timestamptz default now(),
  unique(exercise_name, logged_at)
);

create index if not exists idx_exercise_weights_lookup
  on exercise_weights(exercise_name, logged_at desc);

-- meal_completions: which of the 6 meals were done each day
create table if not exists meal_completions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  meal_index integer not null check (meal_index between 0 and 5),
  created_at timestamptz default now(),
  unique(date, meal_index)
);

create index if not exists idx_meal_completions_date
  on meal_completions(date desc);

-- pain_level: add to posture_checklist
alter table posture_checklist
  add column if not exists pain_level integer not null default 0
  check (pain_level between 0 and 10);

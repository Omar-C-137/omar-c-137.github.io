-- ══════════════════════════════════════════════════════
--  T-O  |  Supabase Database Schema
--  Run this entire file in: Supabase → SQL Editor → New Query
-- ══════════════════════════════════════════════════════

-- 1. PROFILES  (one row per user, linked to auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('coach','trainee')),
  full_name   text,
  email       text,
  specialty   text,
  bio         text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- 2. COACH → TRAINEE RELATIONSHIPS
--    A coach adds a trainee by their user ID
create table if not exists public.coach_clients (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid not null references public.profiles(id) on delete cascade,
  trainee_id  uuid not null references public.profiles(id) on delete cascade,
  notes       text,
  goal        text,
  weight      text,
  weekly_sessions text,
  progress    integer default 0 check (progress >= 0 and progress <= 100),
  tag         text default 'new' check (tag in ('new','active','inactive')),
  created_at  timestamptz default now(),
  unique(coach_id, trainee_id)
);

-- 3. WORKOUT PLANS  (coach writes for a trainee)
create table if not exists public.workout_plans (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid references public.profiles(id) on delete cascade,
  trainee_id  uuid not null references public.profiles(id) on delete cascade,
  created_by  text not null default 'coach' check (created_by in ('coach','trainee')),
  day_label   text not null,   -- e.g. "Monday", "Day 1"
  items       text[] not null, -- array of exercise strings
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- 4. DIET PLANS  (coach writes for a trainee)
create table if not exists public.diet_plans (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid references public.profiles(id) on delete cascade,
  trainee_id  uuid not null references public.profiles(id) on delete cascade,
  created_by  text not null default 'coach' check (created_by in ('coach','trainee')),
  day_label   text not null,
  items       text[] not null,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- SAFELY ALTER EXISTING TABLES TO SUPPORT LOCAL COPIES
alter table if exists public.workout_plans
  alter column coach_id drop not null;
alter table if exists public.workout_plans
  add column if not exists created_by text not null default 'coach';

alter table if exists public.diet_plans
  alter column coach_id drop not null;
alter table if exists public.diet_plans
  add column if not exists created_by text not null default 'coach';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workout_plans_created_by_check'
  ) THEN
    ALTER TABLE public.workout_plans ADD CONSTRAINT workout_plans_created_by_check CHECK (created_by in ('coach','trainee'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_created_by_check'
  ) THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_created_by_check CHECK (created_by in ('coach','trainee'));
  END IF;
END$$;

-- ══════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ══════════════════════════════════════════════

alter table public.profiles        enable row level security;
alter table public.coach_clients   enable row level security;
alter table public.workout_plans   enable row level security;
alter table public.diet_plans      enable row level security;

-- PROFILES policies
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Allow coaches to look up any profile by ID (needed for adding clients)
create policy "Anyone can read basic profile info"
  on public.profiles for select using (true);

-- COACH_CLIENTS policies
create policy "Coach manages own clients"
  on public.coach_clients for all using (auth.uid() = coach_id);

create policy "Trainee views their own coach relationships"
  on public.coach_clients for select using (auth.uid() = trainee_id);

-- WORKOUT_PLANS policies
create policy "Coach manages workout plans"
  on public.workout_plans for all
  using (auth.uid() = coach_id and created_by = 'coach')
  with check (auth.uid() = coach_id and created_by = 'coach');

create policy "Trainee reads own workout plans"
  on public.workout_plans for select using (auth.uid() = trainee_id);

create policy "Trainee manages own workout copies"
  on public.workout_plans for all
  using (auth.uid() = trainee_id and created_by = 'trainee')
  with check (
    auth.uid() = trainee_id and created_by = 'trainee' and (
      coach_id is null
      or coach_id = auth.uid()
      or coach_id = (
        select coach_id from public.coach_clients where trainee_id = auth.uid() limit 1
      )
    )
  );

-- DIET_PLANS policies
create policy "Coach manages diet plans"
  on public.diet_plans for all
  using (auth.uid() = coach_id and created_by = 'coach')
  with check (auth.uid() = coach_id and created_by = 'coach');

create policy "Trainee reads own diet plans"
  on public.diet_plans for select using (auth.uid() = trainee_id);

create policy "Trainee manages own diet copies"
  on public.diet_plans for all
  using (auth.uid() = trainee_id and created_by = 'trainee')
  with check (
    auth.uid() = trainee_id and created_by = 'trainee' and (
      coach_id is null
      or coach_id = auth.uid()
      or coach_id = (
        select coach_id from public.coach_clients where trainee_id = auth.uid() limit 1
      )
    )
  );

-- ══════════════════════════════════════════════════════
--  AUTO-CREATE PROFILE ON SIGNUP  (Supabase Function)
-- ══════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'trainee')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════════════════
--  SEED: Two demo users (after you run this, register
--  these emails in your app to get real UUIDs, or use
--  Supabase Dashboard → Authentication → Add User)
--
--  Demo Coach:   coach@t-o.app    / Coach123!
--  Demo Trainee: trainee@t-o.app  / Train123!
--
--  After creating them in Auth, they'll auto-appear
--  in profiles via the trigger above.
-- ══════════════════════════════════════════════════════

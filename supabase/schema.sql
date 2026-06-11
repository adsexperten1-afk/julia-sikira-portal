-- =====================================================================
--  Julia Sikira Portal – Datenbank-Schema
--  Einmal im Supabase SQL-Editor ausführen (siehe SETUP.md, Schritt 3b).
-- =====================================================================

-- ---- Profile: eine Zeile pro Nutzer, verknüpft mit auth.users ---------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text,
  role        text not null default 'member' check (role in ('member','coach')),
  created_at  timestamptz not null default now()
);

-- ---- Aufgaben: vom Coach einem Teilnehmer zugewiesen ------------------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  detail      text,
  status      text not null default 'open' check (status in ('open','done')),
  created_at  timestamptz not null default now(),
  done_at     timestamptz
);

create index if not exists tasks_member_idx on public.tasks(member_id);

-- ---- Beim Registrieren automatisch ein Profil anlegen ----------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- Hilfsfunktion: ist der aktuelle Nutzer ein Coach? ---------------
--  (security definer => keine RLS-Rekursion auf profiles)
create or replace function public.is_coach()
returns boolean
language sql
security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'coach'
  );
$$;

-- =====================================================================
--  Row Level Security: jeder sieht nur seins, Coach sieht alles
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.tasks    enable row level security;

-- Profile -------------------------------------------------------------
drop policy if exists "profile_read" on public.profiles;
create policy "profile_read" on public.profiles
  for select using (id = auth.uid() or public.is_coach());

drop policy if exists "profile_update_own" on public.profiles;
create policy "profile_update_own" on public.profiles
  for update using (id = auth.uid());

-- Aufgaben ------------------------------------------------------------
drop policy if exists "task_read" on public.tasks;
create policy "task_read" on public.tasks
  for select using (member_id = auth.uid() or public.is_coach());

-- Teilnehmer darf den Status seiner eigenen Aufgabe ändern (abhaken);
-- Coach darf alles ändern.
drop policy if exists "task_update" on public.tasks;
create policy "task_update" on public.tasks
  for update using (member_id = auth.uid() or public.is_coach())
  with check (member_id = auth.uid() or public.is_coach());

-- Nur der Coach legt Aufgaben an ...
drop policy if exists "task_insert_coach" on public.tasks;
create policy "task_insert_coach" on public.tasks
  for insert with check (public.is_coach());

-- ... und nur der Coach löscht sie.
drop policy if exists "task_delete_coach" on public.tasks;
create policy "task_delete_coach" on public.tasks
  for delete using (public.is_coach());

-- ============================================================
-- Secretly — Initial Database Schema
-- Supabase (PostgreSQL) with Row Level Security
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- VAULT ITEMS
-- ============================================================
create table public.vault_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, -- encrypted
  content text not null, -- encrypted
  category text not null default 'note' check (category in ('note', 'password', 'document', 'media', 'financial', 'other')),
  iv text not null, -- initialization vector for AES-GCM
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vault_items enable row level security;

create policy "Users can view own vault items"
  on public.vault_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own vault items"
  on public.vault_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vault items"
  on public.vault_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own vault items"
  on public.vault_items for delete
  using (auth.uid() = user_id);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
create table public.emergency_contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  relationship text,
  is_verified boolean not null default false,
  notify_on_deadman boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.emergency_contacts enable row level security;

create policy "Users can view own contacts"
  on public.emergency_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert own contacts"
  on public.emergency_contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own contacts"
  on public.emergency_contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete own contacts"
  on public.emergency_contacts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- SCHEDULED MESSAGES
-- ============================================================
create table public.scheduled_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipient_email text not null,
  recipient_name text,
  subject text not null, -- encrypted
  content text not null, -- encrypted
  iv text not null, -- initialization vector for AES-GCM
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'cancelled', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scheduled_messages enable row level security;

create policy "Users can view own messages"
  on public.scheduled_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.scheduled_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own messages"
  on public.scheduled_messages for update
  using (auth.uid() = user_id);

create policy "Users can delete own messages"
  on public.scheduled_messages for delete
  using (auth.uid() = user_id);

-- ============================================================
-- DEAD-MAN SWITCH STATUS
-- ============================================================
create table public.deadman_status (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean not null default false,
  check_in_interval_days integer not null default 30,
  last_check_in timestamptz not null default now(),
  next_deadline timestamptz not null default (now() + interval '30 days'),
  grace_period_hours integer not null default 48,
  alert_contacts boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One deadman switch per user
  constraint unique_user_deadman unique (user_id)
);

alter table public.deadman_status enable row level security;

create policy "Users can view own deadman status"
  on public.deadman_status for select
  using (auth.uid() = user_id);

create policy "Users can insert own deadman status"
  on public.deadman_status for insert
  with check (auth.uid() = user_id);

create policy "Users can update own deadman status"
  on public.deadman_status for update
  using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger vault_items_updated_at before update on public.vault_items
  for each row execute procedure public.update_updated_at();

create trigger emergency_contacts_updated_at before update on public.emergency_contacts
  for each row execute procedure public.update_updated_at();

create trigger scheduled_messages_updated_at before update on public.scheduled_messages
  for each row execute procedure public.update_updated_at();

create trigger deadman_status_updated_at before update on public.deadman_status
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_vault_items_user on public.vault_items(user_id);
create index idx_emergency_contacts_user on public.emergency_contacts(user_id);
create index idx_scheduled_messages_user on public.scheduled_messages(user_id);
create index idx_scheduled_messages_status on public.scheduled_messages(status, scheduled_at);
create index idx_deadman_status_user on public.deadman_status(user_id);
create index idx_deadman_status_deadline on public.deadman_status(next_deadline) where is_active = true;

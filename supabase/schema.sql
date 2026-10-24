-- ==============================================================================
-- LaunchKit: Supabase PostgreSQL Schema
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create the `profiles` table linked to `auth.users`
create table if not exists public.profiles ( -- enable row level security
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  stripe_price_id text,
  subscription_status text not null default 'free',
  subscription_period_end timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Performance indexes
create index if not exists idx_profiles_stripe_customer_id on public.profiles (stripe_customer_id);
create index if not exists idx_profiles_subscription_status on public.profiles (subscription_status);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 4. RLS Policies
-- Users can view their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
  on public.profiles 
  for select 
  using (auth.uid() = id);

-- Users can update their own non-sensitive profile information
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on public.profiles 
  for update 
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Column-level privilege restrictions:
-- Strictly limit authenticated users to SELECT and updating non-sensitive profile columns,
-- while relying on RLS and the protective trigger as defense-in-depth.
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant all on public.profiles to postgres;

-- Defense-in-depth trigger to prevent unauthorized tampering of billing columns:
-- Explicitly permits service_role / background admin updates,
-- and strictly blocks regular authenticated users from altering billing columns.
create or replace function public.protect_profile_billing_fields()
returns trigger as $$
begin
  -- Allow service_role (webhooks) to bypass this check
  if (auth.role() = 'service_role') then
    return new;
  end if;

  -- Block regular authenticated users from modifying billing fields
  if (auth.role() = 'authenticated') then
    if (
      new.subscription_status is distinct from old.subscription_status or
      new.stripe_customer_id is distinct from old.stripe_customer_id or
      new.stripe_subscription_id is distinct from old.stripe_subscription_id or
      new.stripe_price_id is distinct from old.stripe_price_id or
      new.subscription_period_end is distinct from old.subscription_period_end
    ) then
      raise exception 'Security violation: modification of subscription billing fields is restricted to administrative webhooks.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

drop trigger if exists on_profile_billing_fields_protected on public.profiles;
create trigger on_profile_billing_fields_protected
  before update on public.profiles
  for each row execute procedure public.protect_profile_billing_fields();

-- 5. Automatically create a profile entry whenever a new user signs up (Email, OAuth, etc.)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    subscription_status
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      ''
    ),
    'free'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

-- 6. Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Auto-update `updated_at` column timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

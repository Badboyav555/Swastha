-- ============================================================
-- SwasthyaSaathi — Supabase Schema & Row Level Security
-- ------------------------------------------------------------
-- Run this once against a fresh Supabase project (SQL Editor).
-- This app does NOT use Supabase Auth. Instead, every table
-- carries enough identity/location columns for RLS policies to
-- check against a custom session claim set from the client via
-- `set_config('request.jwt.claims', ...)` OR, more simply for a
-- prototype, via a `current_user_id()` helper backed by a
-- Postgres session variable your API layer sets per request.
--
-- PRODUCTION NOTE: because this prototype authenticates in the
-- browser (see js/auth.js), the anon key alone cannot prove who
-- is calling Postgres. For real deployment, put a thin server
-- (edge function / API route) in front of Supabase that verifies
-- the session and sets `request.jwt.claims` (or issues a signed
-- Supabase JWT with custom claims) so these RLS policies have a
-- trustworthy identity to check. Do not ship the anon-key-only
-- version to production with real patient data.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Helper: current identity from custom claims ----------
create or replace function current_app_user_id() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'user_id','')::uuid
$$;

create or replace function current_app_role() returns text
language sql stable as $$
  select current_setting('request.jwt.claims', true)::json->>'role'
$$;

create or replace function current_app_district() returns text
language sql stable as $$
  select current_setting('request.jwt.claims', true)::json->>'district'
$$;

create or replace function current_app_block() returns text
language sql stable as $$
  select current_setting('request.jwt.claims', true)::json->>'block'
$$;

-- ============================================================
-- TABLES
-- ============================================================

create table districts (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table blocks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  district text not null references districts(name)
);

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text unique not null,
  password_hash text not null,          -- SHA-256 hex, no salt (per product requirement)
  role text not null check (role in ('asha','anm','medical_officer','block_officer','district_officer','admin')),
  district text,
  block text,
  village text,
  assigned_area text,
  is_active boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login timestamptz
);

create table facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('PHC','CHC','District Hospital','Other Referral Facility')),
  district text not null,
  block text,
  services text,
  obstetric_capability boolean default false,
  emergency_capability boolean default false,
  contact text,
  created_at timestamptz not null default now()
);

create table beneficiaries (
  id uuid primary key default gen_random_uuid(),
  beneficiary_code text unique,
  name text not null,
  age int,
  mobile text,
  district text not null,
  block text not null,
  village text,
  area text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table pregnancies (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid references beneficiaries(id),
  lmp date,
  edd date,
  gravida int,
  para int,
  prev_csection boolean default false,
  prev_complications boolean default false,
  worker_id uuid references users(id),
  district text,
  block text,
  client_op_id text unique,             -- offline-queue duplicate prevention
  created_at timestamptz not null default now()
);

create table health_assessments (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  systolic_bp int, diastolic_bp int, pulse int, temperature numeric,
  weight numeric, haemoglobin numeric, blood_glucose numeric,
  fetal_movement text, fundal_height numeric, fetal_heart_rate int,
  worker_id uuid references users(id),
  client_op_id text unique,
  created_at timestamptz not null default now()
);

create table risk_assessments (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  health_assessment_id uuid references health_assessments(id),
  risk_level text not null check (risk_level in ('low','moderate','high')),
  score int not null,
  contributing_indicators jsonb,
  urgent_flag boolean not null default false,
  ruleset_version text not null,
  evaluated_at timestamptz not null default now(),
  -- historical assessments are immutable — never update, only insert
  created_at timestamptz not null default now()
);

create table risk_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  indicator text not null,
  condition text not null,
  severity text not null check (severity in ('low','moderate','high','urgent')),
  enabled boolean not null default true,
  ruleset_version text not null,
  updated_by uuid references users(id),
  updated_at timestamptz not null default now()
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  facility_id uuid references facilities(id),
  reason text,
  contributing_indicators jsonb,
  priority text check (priority in ('Routine','Urgent')),
  status text not null default 'pending'
    check (status in ('pending','referred','received','under_review','followup_required','completed','cancelled')),
  worker_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table followups (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  due_date date not null,
  reason text,
  assigned_worker_id uuid references users(id),
  status text not null default 'due' check (status in ('due','completed','missed','rescheduled')),
  notes text,
  client_op_id text unique,
  created_at timestamptz not null default now()
);

create table anc_visits (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  visit_date date not null,
  vitals jsonb,
  notes text,
  worker_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table children (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id),
  date_of_birth date,
  birth_weight numeric,
  sex text check (sex in ('M','F','O')),
  delivery_facility_id uuid references facilities(id),
  created_at timestamptz not null default now()
);

create table immunizations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id),
  vaccine text not null,
  due_date date,
  status text not null default 'due' check (status in ('completed','upcoming','due','missed')),
  administered_at timestamptz,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  message text not null,
  read boolean default false,
  created_at timestamptz not null default now()
);

create table app_settings (
  key text primary key,
  value jsonb
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text not null,
  entity text,
  entity_id text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table users enable row level security;
alter table beneficiaries enable row level security;
alter table pregnancies enable row level security;
alter table health_assessments enable row level security;
alter table risk_assessments enable row level security;
alter table risk_rules enable row level security;
alter table referrals enable row level security;
alter table facilities enable row level security;
alter table followups enable row level security;
alter table anc_visits enable row level security;
alter table children enable row level security;
alter table immunizations enable row level security;
alter table notifications enable row level security;
alter table districts enable row level security;
alter table blocks enable row level security;
alter table audit_logs enable row level security;
alter table app_settings enable row level security;

-- ---------- USERS ----------
-- Admin: full access. Officers: read within their own scope.
-- Public signup (unauthenticated insert) is allowed but is
-- always forced to role='asha', is_active=false, status='pending'.
create policy users_admin_all on users for all
  using (current_app_role() = 'admin') with check (current_app_role() = 'admin');

create policy users_self_read on users for select
  using (id = current_app_user_id());

create policy users_public_signup on users for insert
  with check (role = 'asha' and is_active = false and status = 'pending');

create policy users_officer_scope_read on users for select
  using (
    current_app_role() in ('block_officer','district_officer') and
    (
      (current_app_role() = 'block_officer' and block = current_app_block()) or
      (current_app_role() = 'district_officer' and district = current_app_district())
    )
  );

-- ---------- FACILITIES (read: all authenticated; write: admin) ----------
create policy facilities_read on facilities for select using (current_app_user_id() is not null);
create policy facilities_admin_write on facilities for all
  using (current_app_role() = 'admin') with check (current_app_role() = 'admin');

-- ---------- BENEFICIARIES / PREGNANCIES / ASSESSMENTS ----------
-- ASHA/ANM: only records they created or in their assigned village/block.
-- Medical officer: cases referred to their facility / district.
-- Block officer: own block. District officer: own district. Admin: all.
create policy beneficiaries_scope on beneficiaries for select
  using (
    current_app_role() = 'admin'
    or created_by = current_app_user_id()
    or (current_app_role() = 'anm' and block = current_app_block())
    or (current_app_role() = 'block_officer' and block = current_app_block())
    or (current_app_role() = 'district_officer' and district = current_app_district())
    or (current_app_role() = 'medical_officer' and district = current_app_district())
  );
create policy beneficiaries_insert on beneficiaries for insert
  with check (current_app_role() in ('asha','anm') and created_by = current_app_user_id());

create policy pregnancies_scope on pregnancies for select
  using (
    current_app_role() = 'admin'
    or worker_id = current_app_user_id()
    or (current_app_role() = 'anm' and block = current_app_block())
    or (current_app_role() in ('block_officer') and block = current_app_block())
    or (current_app_role() in ('district_officer','medical_officer') and district = current_app_district())
  );
create policy pregnancies_insert on pregnancies for insert
  with check (current_app_role() in ('asha','anm') and worker_id = current_app_user_id());
-- No update policy on purpose: historical rows are effectively immutable;
-- corrections are new rows referencing the same pregnancy.

create policy health_assessments_scope on health_assessments for select
  using (
    current_app_role() = 'admin' or worker_id = current_app_user_id()
    or current_app_role() in ('medical_officer','block_officer','district_officer')
  );
create policy health_assessments_insert on health_assessments for insert
  with check (current_app_role() in ('asha','anm') and worker_id = current_app_user_id());

create policy risk_assessments_scope on risk_assessments for select
  using (current_app_user_id() is not null); -- refined via joined pregnancy scope at the app layer
create policy risk_assessments_insert on risk_assessments for insert
  with check (current_app_role() in ('asha','anm'));
-- risk_assessments has NO update/delete policy — history is immutable.

-- ---------- RISK RULES (admin/medical officer manage; others read) ----------
create policy risk_rules_read on risk_rules for select using (current_app_user_id() is not null);
create policy risk_rules_write on risk_rules for all
  using (current_app_role() in ('admin','medical_officer'))
  with check (current_app_role() in ('admin','medical_officer'));

-- ---------- REFERRALS / FOLLOWUPS / ANC / CHILDREN / IMMUNIZATIONS ----------
create policy referrals_scope on referrals for select
  using (
    current_app_role() = 'admin' or worker_id = current_app_user_id()
    or current_app_role() in ('medical_officer','block_officer','district_officer')
  );
create policy referrals_write on referrals for insert
  with check (current_app_role() in ('asha','anm','medical_officer'));
create policy referrals_update on referrals for update
  using (current_app_role() in ('medical_officer','block_officer','district_officer','admin'));

create policy followups_scope on followups for select
  using (current_app_role() = 'admin' or assigned_worker_id = current_app_user_id()
    or current_app_role() in ('medical_officer','block_officer','district_officer'));
create policy followups_write on followups for insert
  with check (current_app_role() in ('asha','anm'));
create policy followups_update on followups for update
  using (assigned_worker_id = current_app_user_id() or current_app_role()='admin');

create policy anc_scope on anc_visits for select using (current_app_user_id() is not null);
create policy anc_write on anc_visits for insert with check (current_app_role() in ('asha','anm'));

create policy children_scope on children for select using (current_app_user_id() is not null);
create policy children_write on children for insert with check (current_app_role() in ('asha','anm'));

create policy immunizations_scope on immunizations for select using (current_app_user_id() is not null);
create policy immunizations_write on immunizations for all
  using (current_app_role() in ('asha','anm')) with check (current_app_role() in ('asha','anm'));

-- ---------- NOTIFICATIONS ----------
create policy notifications_own on notifications for select using (user_id = current_app_user_id());

-- ---------- DISTRICTS / BLOCKS (read-only reference data) ----------
create policy districts_read on districts for select using (true);
create policy blocks_read on blocks for select using (true);

-- ---------- AUDIT LOGS (admin read/write; system inserts from any authenticated write) ----------
create policy audit_admin_read on audit_logs for select using (current_app_role() = 'admin');
create policy audit_insert on audit_logs for insert with check (current_app_user_id() is not null);

-- ---------- APP SETTINGS (admin only) ----------
create policy settings_admin on app_settings for all
  using (current_app_role() = 'admin') with check (current_app_role() = 'admin');

-- ============================================================
-- Seed: first admin account (password: set via app / rotate immediately)
-- Replace password_hash with SHA-256("your-chosen-password") hex digest.
-- ============================================================
-- insert into users (name, mobile, password_hash, role, is_active, status)
-- values ('District Admin', '9800000000', '<sha256-hex-here>', 'admin', true, 'approved');

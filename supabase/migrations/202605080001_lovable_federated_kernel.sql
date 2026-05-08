create extension if not exists "pgcrypto";

create or replace function public.has_role(required_role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and (p.role = required_role or p.role = 'admin')
  );
$$;

create table if not exists public.digital_twins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  twin_type text not null default 'territory',
  federation_id text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.federations (
  id text primary key,
  name text not null,
  motto text,
  description text,
  color_hex text,
  icon text,
  domain text,
  active boolean not null default true,
  modules jsonb not null default '[]'::jsonb
);

create table if not exists public.manuscripts (
  id text primary key,
  tomo_number int not null,
  title text not null,
  subtitle text,
  description text,
  status text not null default 'draft',
  word_count int not null default 0,
  author text not null default 'Edwin Oswaldo Castillo Trejo',
  ritual_name text not null default 'Anubis Villaseñor',
  orcid text not null default '0009-0008-5050-1539',
  created_at timestamptz not null default now()
);

create table if not exists public.repositories (
  id text primary key,
  github_id bigint,
  name text not null,
  full_name text not null,
  description text,
  url text not null,
  homepage text,
  language text,
  topics text[] default '{}',
  federation_id text references public.federations(id),
  classification text,
  is_core boolean not null default false,
  stars int not null default 0,
  forks int not null default 0,
  size_kb int not null default 0,
  default_branch text,
  pushed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.protocol_executions (
  id uuid primary key default gen_random_uuid(),
  protocol text not null,
  action text not null,
  decision text not null,
  payload jsonb not null default '{}'::jsonb,
  hash_sha256 text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bookpi_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  narrative text not null,
  hash_sha256 text not null,
  signature text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_signatures (
  id uuid primary key default gen_random_uuid(),
  subject_table text not null,
  subject_id text not null,
  hash_sha256 text not null,
  signature text not null,
  created_at timestamptz not null default now()
);

alter table if exists public.businesses
  add column if not exists commerce_type text not null default 'tiendita',
  add column if not exists monthly_fee_cents int not null default 25000,
  add column if not exists registration_fee_cents int not null default 29900,
  add column if not exists next_payment_due timestamptz,
  add column if not exists payment_status text not null default 'active';

create table if not exists public.commerce_tariffs (
  commerce_type text primary key,
  registration_fee_cents int not null,
  monthly_fee_cents int not null
);

insert into public.commerce_tariffs values
  ('gondola', 24900, 20000),
  ('tiendita', 29900, 25000),
  ('plateria', 39900, 30000),
  ('hotel', 69900, 50000),
  ('transporte_externo', 50000, 5000),
  ('premium', 269900, 69900)
on conflict (commerce_type) do update set registration_fee_cents = excluded.registration_fee_cents, monthly_fee_cents = excluded.monthly_fee_cents;

create or replace function public.suspend_overdue_businesses()
returns trigger language plpgsql as $$
begin
  if new.next_payment_due is not null and new.next_payment_due < now() - interval '7 days' and new.payment_status in ('active', 'grace') then
    new.payment_status := 'suspended';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_suspend_overdue_businesses on public.businesses;
create trigger trg_suspend_overdue_businesses before insert or update on public.businesses for each row execute function public.suspend_overdue_businesses();

alter table public.digital_twins enable row level security;
alter table public.federations enable row level security;
alter table public.manuscripts enable row level security;
alter table public.repositories enable row level security;
alter table public.protocol_executions enable row level security;
alter table public.bookpi_entries enable row level security;
alter table public.audit_signatures enable row level security;
alter table public.commerce_tariffs enable row level security;

create policy if not exists "public read digital_twins" on public.digital_twins for select using (true);
create policy if not exists "public read federations" on public.federations for select using (true);
create policy if not exists "public read manuscripts" on public.manuscripts for select using (true);
create policy if not exists "public read repositories" on public.repositories for select using (true);
create policy if not exists "public read commerce_tariffs" on public.commerce_tariffs for select using (true);
create policy if not exists "admin write digital_twins" on public.digital_twins for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy if not exists "admin write federations" on public.federations for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy if not exists "admin write manuscripts" on public.manuscripts for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy if not exists "admin write repositories" on public.repositories for all using (public.has_role('admin')) with check (public.has_role('admin'));

insert into public.federations (id, name, motto, description, color_hex, icon, domain, modules) values
  ('educativa', 'Federación Educativa TAMV', 'Aprender para liberar', 'Pedagogía descolonizada, UTAMV y alfabetización tecnológica territorial.', '#6b7f5f', 'graduation-cap', 'edu.rdm.tamv', '["UTAMV","Aulas vivas","Masterclass"]'),
  ('cultural', 'Federación Cultural TAMV', 'La memoria no se vende', 'Archivo oral, manuscritos, patrimonio cornish-otomí y ritualidad cívica.', '#8b5e34', 'book-open', 'cul.rdm.tamv', '["Manuscrito","Archivo oral","Patrimonio"]'),
  ('economica', 'Federación Económica TAMV', 'Economía para sostener la vida', 'Mercado soberano, pagos, cooperativas y visibilidad condicionada.', '#a87844', 'coins', 'eco.rdm.tamv', '["Mercado","Stripe","Cooperativas"]'),
  ('tecnologica', 'Federación Tecnológica TAMV', 'Código que no coloniza', 'Kernel Isabella, Edge Functions, GitHub Sync e infraestructura soberana.', '#6b8aa0', 'cpu', 'tec.rdm.tamv', '["Kernel","Isabella","GitHub Sync"]'),
  ('salud', 'Federación de Salud TAMV', 'Cuerpo territorio, territorio cuerpo', 'Salud comunitaria, bienestar y rutas seguras.', '#7d9b7a', 'heart-pulse', 'sal.rdm.tamv', '["Bienestar","Herbolaria","Rutas seguras"]'),
  ('comunicacion', 'Federación de Comunicación TAMV', 'La narrativa propia', 'Medios soberanos, blog, radio y memoria pública.', '#9b6b4a', 'radio', 'com.rdm.tamv', '["Blog","Radio","Prensa"]'),
  ('gubernamental', 'Federación Gubernamental TAMV', 'Asamblea, no representación', 'Consejo Nodo Cero, auditoría EOCT/MSR y federación pública.', '#5e5048', 'scale', 'gob.rdm.tamv', '["Consejo","MSR","BookPI"]')
on conflict (id) do update set description = excluded.description, modules = excluded.modules;

insert into public.manuscripts (id, tomo_number, title, subtitle, description, status, word_count) values
  ('tomo-i-genesis', 1, 'Tomo I — Génesis', 'Origen del Nodo Cero y declaración del Arquitecto', 'Fundamento ontológico, ritual e institucional de RDM Digital.', 'published', 21600),
  ('tomo-ii-kernel', 2, 'Tomo II — Kernel TAMV', 'Núcleo cognitivo y soberanía algorítmica', 'Arquitectura del Kernel TAMV, Isabella y protocolos EOCT/MSR/BookPI.', 'published', 18400),
  ('tomo-iii-territorio', 3, 'Tomo III — Territorio', 'Real del Monte como cuerpo geográfico', 'POIs federados, geolocalización y memoria minera cornish-otomí.', 'in_progress', 9200),
  ('tomo-iv-geopolitica', 4, 'Tomo IV — Geopolítica', 'Hidalgo como Nodo Cero del Sur Global', 'Articulación civilizatoria y anti-extractivismo digital.', 'in_progress', 8700)
on conflict (id) do update set status = excluded.status, word_count = excluded.word_count;

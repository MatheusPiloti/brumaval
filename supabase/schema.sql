-- Brumaval: banco de dados das contas e personagens (Supabase / PostgreSQL)
-- Como usar: no painel do Supabase, abra "SQL Editor", cole este arquivo inteiro e clique em "Run".

-- Perfil de cada conta. O VIP fica aqui e só o servidor pode mudar (etapa 3, pagamento).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  vip_until timestamptz
);
alter table public.profiles enable row level security;
drop policy if exists "ver o próprio perfil" on public.profiles;
create policy "ver o próprio perfil" on public.profiles for select using (auth.uid() = id);
-- Sem política de insert/update: o jogador não consegue se dar VIP.

-- Cria o perfil automaticamente quando alguém se cadastra.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Personagens: o save completo fica em "data" (JSON).
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 16),
  cls text not null,
  level int not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists characters_user_id_idx on public.characters (user_id);
alter table public.characters enable row level security;
drop policy if exists "ver os próprios personagens" on public.characters;
drop policy if exists "criar os próprios personagens" on public.characters;
drop policy if exists "atualizar os próprios personagens" on public.characters;
drop policy if exists "apagar os próprios personagens" on public.characters;
create policy "ver os próprios personagens" on public.characters for select using (auth.uid() = user_id);
create policy "criar os próprios personagens" on public.characters for insert with check (auth.uid() = user_id);
create policy "atualizar os próprios personagens" on public.characters for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar os próprios personagens" on public.characters for delete using (auth.uid() = user_id);

-- No máximo 3 personagens por conta.
create or replace function public.limit_characters() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.characters where user_id = new.user_id) >= 3 then
    raise exception 'Limite de 3 personagens por conta';
  end if;
  return new;
end; $$;
drop trigger if exists characters_limit on public.characters;
create trigger characters_limit before insert on public.characters
  for each row execute function public.limit_characters();

-- Execute uma vez no SQL Editor de um projeto Supabase novo.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 140),
  author text not null check (length(trim(author)) between 1 and 60),
  category text not null check (category in ('Tecnologia','Cultura','Games','Devaneios')),
  excerpt text not null check (length(trim(excerpt)) between 1 and 280),
  body text not null check (length(trim(body)) between 1 and 40000),
  cover text check (cover = '' or (length(cover) <= 2000 and cover ~ '^https://')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
alter table public.posts enable row level security;
revoke all on public.posts from anon, authenticated;
grant select, insert on public.posts to anon, authenticated;
create policy "Leitura publica" on public.posts for select to anon, authenticated using (true);
create policy "Publicacao aberta" on public.posts for insert to anon, authenticated with check (true);
-- Não há políticas de UPDATE/DELETE públicas. Modere pelo painel do projeto.

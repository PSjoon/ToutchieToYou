-- Execute uma vez para habilitar exclusao logica sem login.
-- Qualquer visitante pode ocultar qualquer publicacao, conforme o modelo publico.
alter table public.posts add column if not exists deleted_at timestamptz;
grant update (deleted_at) on public.posts to anon, authenticated;
drop policy if exists "Exclusao logica publica" on public.posts;
create policy "Exclusao logica publica" on public.posts
  for update to anon, authenticated
  using (deleted_at is null) with check (deleted_at is not null);
-- Os registros permanecem no banco; restauracao pelo painel do proprietario.

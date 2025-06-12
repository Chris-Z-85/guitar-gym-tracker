create table public.practice_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  unique(name, user_id)
);

-- Set up Row Level Security (RLS)
alter table public.practice_items enable row level security;

create policy "Users can view their own practice items"
  on public.practice_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own practice items"
  on public.practice_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own practice items"
  on public.practice_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own practice items"
  on public.practice_items for delete
  using (auth.uid() = user_id); 
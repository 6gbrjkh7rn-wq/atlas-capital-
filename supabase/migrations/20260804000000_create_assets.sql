create table if not exists assets (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  ticker text,
  asset_type text not null,

  quantity numeric(20,8) default 0,
  average_price numeric(20,8) default 0,
  current_price numeric(20,8) default 0,

  currency text default 'EUR',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

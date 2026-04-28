-- Expand supplement_weekly to support split hipercalorico tracking
-- Keep old 'hipercalorico' value for backward compat (old rows remain valid)
alter table supplement_weekly
  drop constraint if exists supplement_weekly_supplement_check;

alter table supplement_weekly
  add constraint supplement_weekly_supplement_check
  check (supplement in (
    'creatina',
    'whey',
    'hipercalorico',
    'hipercalorico_manha',
    'hipercalorico_noite',
    'hipercalorico_tarde'
  ));

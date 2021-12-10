CREATE OR REPLACE FUNCTION public.func_update_scheduled()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- if insert or update happen by date or location, change scheduled
    if TG_OP = 'INSERT' or (new.birthday_date != old.birthday_date or old.location != new.location) then
        new.scheduled = make_timestamptz(
        extract(year from (now() at time zone new.zone))::int
        , extract (month from new.birthday_date)::int
        , extract (day from new.birthday_date)::int
        , 9, 0, 0, new.zone) at time zone 'UTC';
        -- old is next year (already celebrated today), update scheduled to next year
        IF TG_OP = 'UPDATE' and extract(year from old.scheduled) > extract(year from new.scheduled) then
            new.scheduled = new.scheduled + interval '1 year';
        end if;
        -- new.scheduled is already behind a day, so no celebration
        IF TG_OP = 'INSERT' and new.scheduled < now() - '1 day'::interval then
            new.scheduled = new.scheduled + interval '1 year';
        end if;
        
    end if;

  -- after celebration we increase 1 year for future scheduled
  if TG_OP = 'UPDATE' and (new.status = 'CELEBRATED') then
        new.scheduled = make_timestamptz(
        extract(year from (now() at time zone new.zone))::int + 1
        , extract (month from new.birthday_date)::int
        , extract (day from new.birthday_date)::int
        , 9, 0, 0, new.zone) at time zone 'UTC';
        new.status = 'UNCELEBRATED';
    end if;

    return new;
END;
$function$
;

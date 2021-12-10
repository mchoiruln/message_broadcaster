CREATE OR REPLACE FUNCTION public.func_update_scheduled()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    if TG_OP = 'INSERT' or (new.birthday_date != old.birthday_date or old.location != new.location) then
        new.scheduled = make_timestamptz(
        extract(year from (now() at time zone new.zone))::int
        , extract (month from new.birthday_date)::int
        , extract (day from new.birthday_date)::int
        , 9, 0, 0, new.zone) at time zone 'UTC';
    end if;

    return new;
END;
$function$
;

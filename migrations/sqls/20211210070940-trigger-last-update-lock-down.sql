DROP TRIGGER if exists tr_last_updated_lock ON public."users";

DROP FUNCTION if exists "public".func_last_updated_lock();

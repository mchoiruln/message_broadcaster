CREATE FUNCTION func_last_updated_lock() RETURNS trigger AS $$
BEGIN
    NEW.last_updated_lock := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_last_updated_lock BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE func_last_updated_lock();
CREATE TRIGGER trg_refresh_mv_on_transaction
AFTER INSERT OR UPDATE OR DELETE ON transaction
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_mv_daily_category_stat();

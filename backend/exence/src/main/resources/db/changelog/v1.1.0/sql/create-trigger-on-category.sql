CREATE TRIGGER trg_refresh_mv_on_category
AFTER UPDATE OF name, color ON category
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_mv_daily_category_stat();

CREATE MATERIALIZED VIEW mv_daily_category_stat AS
SELECT
    t.workspace_id,
    t.date AS stat_date,
    t.category_id,
    t.type,
    c.name AS category_name,
    c.color AS category_color,
    CAST(c.icon AS TEXT) AS category_icon,
    SUM(t.amount) AS total_amount,
    COUNT(t.id) AS transaction_count,
    MAX(t.amount) AS max_amount
FROM transaction t
JOIN category c ON t.category_id = c.id
GROUP BY t.workspace_id, t.date, t.category_id, t.type, c.name, c.color, c.icon
WITH DATA;

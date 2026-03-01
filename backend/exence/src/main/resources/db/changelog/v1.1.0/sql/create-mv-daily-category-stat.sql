CREATE MATERIALIZED VIEW mv_daily_category_stat AS
SELECT
    t.user_id,
    date_trunc('day', t.date AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS stat_date,
    t.category_id,
    t.type,
    c.name AS category_name,
    c.color AS category_color,
    SUM(t.amount) AS total_amount,
    COUNT(t.id) AS transaction_count,
    MAX(t.amount) AS max_amount
FROM transaction t
JOIN category c ON t.category_id = c.id
GROUP BY t.user_id, date_trunc('day', t.date AT TIME ZONE 'UTC') AT TIME ZONE 'UTC', t.category_id, t.type, c.name, c.color
WITH DATA;

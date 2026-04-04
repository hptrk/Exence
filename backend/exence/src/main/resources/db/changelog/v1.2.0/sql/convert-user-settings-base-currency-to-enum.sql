-- the default value should be dropped before changing the type, otherwise the migration will fail because the default value is not compatible with the new type
ALTER TABLE user_settings ALTER COLUMN base_currency DROP DEFAULT;

ALTER TABLE user_settings ALTER COLUMN base_currency TYPE supported_currency USING base_currency::supported_currency;

ALTER TABLE user_settings ALTER COLUMN base_currency SET DEFAULT 'HUF'::supported_currency;

ALTER TABLE partners ADD COLUMN IF NOT EXISTS websites jsonb NOT NULL DEFAULT '[]';

UPDATE partners
SET websites = jsonb_build_array(jsonb_build_object('label', website, 'url', website))
WHERE website IS NOT NULL AND websites = '[]'::jsonb;

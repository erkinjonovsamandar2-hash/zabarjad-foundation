ALTER TABLE partners ADD COLUMN IF NOT EXISTS maps_urls jsonb NOT NULL DEFAULT '[]';

UPDATE partners
SET maps_urls = jsonb_build_array(jsonb_build_object('label', 'Xaritada ko''rish', 'url', maps_url))
WHERE maps_url IS NOT NULL AND maps_urls = '[]'::jsonb;

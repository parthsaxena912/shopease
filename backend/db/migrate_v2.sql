ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop' WHERE name = 'Wireless Mouse';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1595225476474-89b0f6c96a1a?w=500&h=500&fit=crop' WHERE name = 'Mechanical Keyboard';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop' WHERE name = 'USB-C Hub';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&h=500&fit=crop' WHERE name = 'Laptop Stand';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=500&fit=crop' WHERE name = 'Webcam 1080p';

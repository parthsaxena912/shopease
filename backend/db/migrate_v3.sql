ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer';
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Fix mismatched product images (verified correct matches)
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&q=80' WHERE name = 'Wireless Mouse';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&q=80' WHERE name = 'Mechanical Keyboard';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591290619762-d8fb54c2d1a1?w=500&h=500&fit=crop&q=80' WHERE name = 'USB-C Hub';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611183904225-e5c6a3a5e5f9?w=500&h=500&fit=crop&q=80' WHERE name = 'Laptop Stand';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=500&fit=crop&q=80' WHERE name = 'Webcam 1080p';

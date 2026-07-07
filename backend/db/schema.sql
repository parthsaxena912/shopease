CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url VARCHAR(500),
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'placed',
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

INSERT INTO products (name, description, price, image_url, stock) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 799.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 50),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 3499.00, 'https://images.unsplash.com/photo-1595225476474-89b0f6c96a1a?w=500&h=500&fit=crop', 30),
('USB-C Hub', '7-in-1 USB-C hub with HDMI and card reader', 1299.00, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop', 40),
('Laptop Stand', 'Aluminum adjustable laptop stand', 1899.00, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&h=500&fit=crop', 25),
('Webcam 1080p', 'Full HD webcam with built-in mic', 2299.00, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=500&fit=crop', 20)
ON CONFLICT DO NOTHING;

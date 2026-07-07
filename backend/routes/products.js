const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS seller_name
       FROM products p
       LEFT JOIN users u ON u.id = p.seller_id
       ORDER BY p.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/mine/list', requireAuth, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE seller_id = $1 ORDER BY id DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS seller_name
       FROM products p
       LEFT JOIN users u ON u.id = p.seller_id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', requireAuth, requireRole('seller', 'admin'), async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description || '', price, image_url || '', stock || 100, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', requireAuth, requireRole('seller', 'admin'), async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (req.userRole !== 'admin' && existing.rows[0].seller_id !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own products' });
    }

    const result = await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, stock = $5
       WHERE id = $6 RETURNING *`,
      [name, description, price, image_url, stock, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', requireAuth, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (req.userRole !== 'admin' && existing.rows[0].seller_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;

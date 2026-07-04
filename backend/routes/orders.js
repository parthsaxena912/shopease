const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// PLACE ORDER (checkout) - turns cart into an order, then clears cart
router.post('/checkout', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartResult.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'placed') RETURNING *`,
      [req.userId, total]
    );
    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  } finally {
    client.release();
  }
});

// GET order history for current user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;

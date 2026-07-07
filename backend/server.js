const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShopEase backend is running' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

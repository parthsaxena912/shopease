import { useEffect, useState } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    const res = await client.get('/cart');
    setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (id) => {
    await client.delete(`/cart/${id}`);
    loadCart();
  };

  const checkout = async () => {
    await client.post('/orders/checkout');
    alert('Order placed!');
    navigate('/orders');
  };

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-xl font-bold">Total: ₹{total.toFixed(2)}</span>
            <button
              onClick={checkout}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

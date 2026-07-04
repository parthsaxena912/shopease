import { useEffect, useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Cart() {
  const { items, refreshCart, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart().then(() => setLoading(false));
  }, []);

  const checkout = async () => {
    try {
      await client.post('/orders/checkout');
      toast.success('Order placed successfully!');
      await refreshCart();
      navigate('/orders');
    } catch {
      toast.error('Checkout failed');
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-10 text-center text-slate-400">Loading your cart...</div>;
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <ShoppingBag className="mx-auto text-slate-300 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-slate-700">Your cart is empty</h2>
        <p className="text-slate-400 mt-1">Add something you like — it'll show up here.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4"
          >
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-slate-500 text-sm mt-0.5">₹{item.price} each</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1.5 text-slate-500 hover:text-indigo-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm ml-2"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
            <div className="font-bold text-slate-900 text-lg">
              ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">Total</p>
          <p className="text-3xl font-extrabold text-slate-900">₹{total.toLocaleString('en-IN')}</p>
        </div>
        <button
          onClick={checkout}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Checkout <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

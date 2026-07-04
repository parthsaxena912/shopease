import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      toast.success(`${product.name} added to cart`);
      setTimeout(() => setAdded(false), 1500);
      setQty(1);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock < 15 && (
          <span className="absolute top-3 left-3 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 leading-tight">{product.name}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-extrabold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>

          <div className="flex items-center border border-slate-200 rounded-lg">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-1.5 text-slate-500 hover:text-indigo-600"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="p-1.5 text-slate-500 hover:text-indigo-600"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-slate-900 text-white hover:bg-indigo-600'
          }`}
        >
          {added ? (
            <>
              <Check size={16} /> Added
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

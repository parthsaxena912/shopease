import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const addToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await client.post('/cart', { productId, quantity: 1 });
    alert('Added to cart!');
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{p.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">₹{p.price}</span>
              <button
                onClick={() => addToCart(p.id)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

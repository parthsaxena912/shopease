import { useEffect, useState } from 'react';
import { Trash2, Package, ShieldCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        client.get('/products'),
        client.get('/orders/admin/all'),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await client.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading admin dashboard...</div>;

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-slate-500 text-sm">Total Orders</p>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-slate-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-slate-500 text-sm">Total Products</p>
          <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          All Products
        </button>
      </div>

      {tab === 'orders' && (
        orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package className="mx-auto mb-3" size={48} />
            No orders placed yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900">Order #{o.id}</p>
                  <p className="text-sm text-slate-500">{o.customer_name} · {o.customer_email} · {new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{Number(o.total).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-600 capitalize">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                <p className="text-slate-500 text-sm mt-1">₹{p.price} · Stock: {p.stock}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Users size={12} /> {p.seller_name || 'Platform default'}
                </p>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 border border-red-200 text-red-600 rounded-lg py-2 text-sm font-medium hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

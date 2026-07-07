import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', stock: '' });
  const [tab, setTab] = useState('products');

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        client.get('/products/mine/list'),
        client.get('/orders/seller/mine'),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image_url: '', stock: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await client.put(`/products/${editingId}`, form);
        toast.success('Product updated');
      } else {
        await client.post('/products', form);
        toast.success('Product added');
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await client.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Seller Dashboard</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          My Products ({products.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 relative">
          <button onClick={resetForm} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
          <h2 className="font-bold text-lg mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Product name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 sm:col-span-2" required
            />
            <textarea
              placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 sm:col-span-2" rows="2"
            />
            <input
              type="number" step="0.01" placeholder="Price (₹)" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5" required
            />
            <input
              type="number" placeholder="Stock quantity" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5"
            />
            <input
              type="url" placeholder="Image URL" value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="border border-slate-200 rounded-xl px-4 py-2.5 sm:col-span-2"
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {tab === 'products' && (
        products.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package className="mx-auto mb-3" size={48} />
            You haven't listed any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">₹{p.price} · Stock: {p.stock}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 rounded-lg py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-600 rounded-lg py-2 text-sm font-medium hover:bg-red-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'orders' && (
        orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package className="mx-auto mb-3" size={48} />
            No orders for your products yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900">{o.product_name} × {o.quantity}</p>
                  <p className="text-sm text-slate-500">Order #{o.id} · {o.customer_name} · {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-slate-900">₹{(o.price * o.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

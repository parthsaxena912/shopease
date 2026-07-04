import { useEffect, useState } from 'react';
import { Package, CheckCircle2 } from 'lucide-react';
import client from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto p-10 text-center text-slate-400">Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-400">No orders yet — go find something you like.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                  <Package size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Order #{o.id}</p>
                  <p className="text-sm text-slate-500">{new Date(o.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-lg text-slate-900">₹{Number(o.total).toLocaleString('en-IN')}</p>
                <p className="flex items-center gap-1 text-sm text-green-600 font-medium justify-end">
                  <CheckCircle2 size={14} /> {o.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

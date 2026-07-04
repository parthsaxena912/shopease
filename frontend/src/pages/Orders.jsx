import { useEffect, useState } from 'react';
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

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-lg p-4 flex justify-between">
              <div>
                <p className="font-semibold">Order #{o.id}</p>
                <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{o.total}</p>
                <p className="text-sm text-green-600 capitalize">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

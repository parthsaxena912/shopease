import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import client from '../api/client';
import ProductCard from '../components/ProductCard';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-8 bg-slate-200 rounded w-1/2 mt-2" />
        <div className="h-10 bg-slate-200 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    client.get('/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles size={14} /> Fresh tech, everyday prices
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Gear up for your setup
          </h1>
          <p className="text-indigo-100 mt-3 max-w-lg mx-auto">
            Curated accessories for your desk, built to last, priced to make sense.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {search ? `Results for "${search}"` : 'All Products'}
          </h2>
          <span className="text-slate-500 text-sm">{filtered.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
}

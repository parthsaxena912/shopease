import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Store size={18} className="text-indigo-600" /> ShopEase
        </div>
        <p className="text-slate-400 text-sm">Built as a full-stack DevOps demo project.</p>
      </div>
    </footer>
  );
}

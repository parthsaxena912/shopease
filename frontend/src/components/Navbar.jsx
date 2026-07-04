import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, LogOut, User, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Store size={20} />
          </div>
          ShopEase
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                <Package size={20} />
                <span className="hidden sm:inline text-sm font-medium">Orders</span>
              </Link>

              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200">
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
                  <User size={16} />
                  {user.name.split(' ')[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">ShopEase</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
            <span className="text-gray-500 text-sm">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="text-red-600 text-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Mail, Lock, User, Store, ShoppingBag, Briefcase } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password, role);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-50 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex bg-indigo-600 text-white p-3 rounded-2xl mb-3">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Start shopping or start selling</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google sign-in failed')}
              width="280"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Role picker */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition ${
                role === 'customer'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <ShoppingBag size={20} />
              <span className="text-sm font-semibold">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition ${
                role === 'seller'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Briefcase size={20} />
              <span className="text-sm font-semibold">Seller</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? 'Creating account...' : `Sign Up as ${role === 'seller' ? 'Seller' : 'Customer'}`}
            </button>
          </form>
        </div>

        <p className="text-sm mt-5 text-center text-slate-500">
          Have an account? <Link to="/login" className="text-indigo-600 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}

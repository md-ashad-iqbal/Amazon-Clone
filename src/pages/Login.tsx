import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      navigate(redirect);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@shopsphere.com');
    setPassword('demo12345');
  };

  return (
    <div className="mx-auto max-w-md py-6">
      {/* Brand Logo Header */}
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm">
            <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Shop<span className="text-amber-500">Sphere</span>
          </span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">to continue to your ShopSphere account</p>

        {/* 1-Click Demo Login Helper */}
        <div className="mt-4 rounded-xl bg-amber-50 p-3.5 ring-1 ring-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-900">Demo Testing Account</p>
              <p className="text-xs text-amber-700">demo@shopsphere.com / demo12345</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-500 shadow-xs"
            >
              Fill Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700" htmlFor="email">
              Email address
            </label>
            <div className="relative mt-1">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700" htmlFor="password">
                Password
              </label>
              <span className="text-xs text-sky-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-amber-400 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-500 disabled:opacity-50 shadow-sm"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-600">
            By signing in, you agree to ShopSphere's simulated Conditions of Use and Privacy Notice.
          </p>
        </div>
      </div>

      {/* New customer card */}
      <div className="mt-6 text-center">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#f8fafc] px-3 text-slate-500 font-medium">New to ShopSphere?</span>
          </div>
        </div>

        <Link
          to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 shadow-xs"
        >
          Create your ShopSphere account
        </Link>
      </div>
    </div>
  );
}

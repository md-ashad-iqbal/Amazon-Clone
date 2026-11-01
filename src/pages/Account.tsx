import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Heart, HelpCircle, Lock, LogOut, MapPin, Package, Shield, User, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <User className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your Account</h1>
        <p className="mt-2 text-sm text-slate-600">Please sign in to access your profile and settings.</p>
        <Link to="/login?redirect=/account" className="btn-primary mt-6 inline-block w-full">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const success = await updateProfile(name);
    setSaving(false);
    if (success) setEditingName(false);
  };

  const TILES = [
    {
      title: 'Your Orders',
      description: 'Track packages, edit or cancel orders, and view past purchases',
      icon: Package,
      href: '/orders',
    },
    {
      title: 'Your Addresses',
      description: 'Edit, remove or set default delivery addresses for orders',
      icon: MapPin,
      href: '/addresses',
    },
    {
      title: 'Your Wishlist',
      description: 'View saved items, move to cart, or create custom gift lists',
      icon: Heart,
      href: '/wishlist',
    },
    {
      title: 'Customer Service',
      description: 'Browse FAQs, shipping rates, returns, and simulated help guides',
      icon: HelpCircle,
      href: '/support',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Your Account</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your profile, preferences, orders, and delivery addresses</p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-2xl font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {editingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-500 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingName(false);
                      setName(user.name);
                    }}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="text-xs font-semibold text-sky-700 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  {user.role}
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <UserCheck className="h-3.5 w-3.5" />
                  Verified Demo Account
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Amazon-style Account Hub Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.title}
              to={tile.href}
              className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 hover:text-amber-700">{tile.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tile.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Address } from '@/types';
import toast from 'react-hot-toast';

export default function Addresses() {
  const { user, isAuthenticated, addAddress, updateAddress, deleteAddress } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <MapPin className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your Addresses</h1>
        <p className="mt-2 text-sm text-slate-600">Please sign in to view and manage your addresses.</p>
        <Link to="/login?redirect=/addresses" className="btn-primary mt-6 inline-block w-full">
          Sign In
        </Link>
      </div>
    );
  }

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      toast.error('All address fields are required.');
      return;
    }

    setSubmitting(true);
    const success = await addAddress({
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      isDefault,
    });
    setSubmitting(false);

    if (success) {
      setModalOpen(false);
      setFullName('');
      setPhone('');
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setIsDefault(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    await updateAddress(id, { isDefault: true });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this address?')) {
      await deleteAddress(id);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-500">
            <Link to="/account" className="hover:underline">Your Account</Link>
            <span>&rsaquo;</span>
            <span className="text-slate-800 font-medium">Your Addresses</span>
          </nav>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Your Addresses</h1>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-500 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add Address Card */}
        <div
          onClick={() => setModalOpen(true)}
          className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-amber-500 hover:bg-amber-50/20"
        >
          <Plus className="h-8 w-8 text-slate-400" />
          <span className="mt-2 text-base font-bold text-slate-800">Add Address</span>
        </div>

        {/* Saved Addresses Cards */}
        {user.addresses?.map((addr) => (
          <div
            key={addr.id}
            className={`flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 transition ${
              addr.isDefault ? 'ring-2 ring-amber-500' : 'ring-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900">{addr.fullName}</h3>
                {addr.isDefault && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-0.5 text-xs text-slate-600 leading-relaxed">
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p>India</p>
                <p className="mt-2 text-slate-500">Phone number: {addr.phone}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs">
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="font-semibold text-sky-700 hover:underline"
                >
                  Set as default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="ml-auto font-semibold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900">Add a new address</h2>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ashad Iqbal"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Flat, House no., Building, Street</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Address"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">PIN Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="6 digits [0-9]"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Make this my default address</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-500 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

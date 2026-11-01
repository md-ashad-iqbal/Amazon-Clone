import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CreditCard, Lock, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiClient } from '@/services/api';
import { formatINR } from '@/utils/format';
import ProductImage from '@/components/common/ProductImage';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { user, isAuthenticated, addAddress } = useAuth();
  const { lines, subtotal, savings, deliveryCharge, total, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New address form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'TEST_CHECKOUT'>('COD');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Sync default address on user load
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else {
      setIsAddingAddress(true);
    }
  }, [user]);

  // If cart is empty, redirect to cart page
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-600">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="btn-primary mt-6 inline-block">
          Explore Products
        </Link>
      </div>
    );
  }

  // If not logged in, prompt sign in
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <Lock className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Sign in to Checkout</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in or create an account to save your delivery addresses and review simulated orders.
        </p>
        <div className="mt-6 space-y-3">
          <Link
            to="/login?redirect=/checkout"
            className="block w-full rounded-lg bg-amber-400 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-500 shadow-sm"
          >
            Sign In with Demo Account
          </Link>
          <Link
            to="/register?redirect=/checkout"
            className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  const selectedAddress = user?.addresses?.find((a) => a.id === selectedAddressId);

  const handleAddNewAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      toast.error('Please fill in all address fields.');
      return;
    }

    const success = await addAddress({
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      isDefault: !user?.addresses || user.addresses.length === 0,
    });

    if (success) {
      setIsAddingAddress(false);
      // Select the newest address
      const latest = user?.addresses[user.addresses.length - 1];
      if (latest) setSelectedAddressId(latest.id);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address.');
      setIsAddingAddress(true);
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
        },
        paymentMethod,
      };

      const res = await apiClient.post('/orders', orderPayload);
      if (res.data.success && res.data.order) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${res.data.order.orderId}`);
        return;
      }
      toast.error(res.data.message || 'Failed to place order.');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1300px] py-4">
      {/* Checkout Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500">
            Secure Simulated Checkout ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          <span>100% Educational Simulation — No Real Charges</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Checkout Steps */}
        <div className="space-y-6">
          {/* Step 1: Delivery Address */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-lg font-bold text-slate-900">Select delivery address</h2>
              </div>
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add new address
                </button>
              )}
            </div>

            {/* Existing Addresses List */}
            {user?.addresses && user.addresses.length > 0 && !isAddingAddress && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {user.addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`cursor-pointer rounded-xl p-4 transition ring-1 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500'
                          : 'border-slate-200 bg-white ring-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{addr.street}</p>
                      <p className="text-xs text-slate-600">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Phone: {addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddNewAddress} className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Add a new delivery address</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ashad Iqbal"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
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
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Flat, House no., Building, Street</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street address"
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
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
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="6 digits [0-9]"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="rounded-md bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-500"
                  >
                    Use this address
                  </button>
                  {user?.addresses && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Step 2: Payment Method (Simulated) */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-900">Select payment method</h2>
            </div>

            {/* Mandatory Demonstration Notice */}
            <div className="mt-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-300/80">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-700" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">Simulated Demonstration Payment</p>
                  <p className="mt-0.5">
                    This is an educational demo marketplace. No real payment gateway (Stripe/Razorpay) is integrated.
                    Choose a simulated payment option below to verify the complete checkout and order lifecycle.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Cash on Delivery (Simulated) */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 transition ring-1 ${
                  paymentMethod === 'COD'
                    ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500'
                    : 'border-slate-200 bg-white ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-700" />
                    <span className="text-sm font-bold text-slate-900">Cash on Delivery (Simulated)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Pay cash or UPI upon package arrival at your doorstep.</p>
                </div>
              </label>

              {/* Instant Test Checkout (Simulated) */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 transition ring-1 ${
                  paymentMethod === 'TEST_CHECKOUT'
                    ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500'
                    : 'border-slate-200 bg-white ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'TEST_CHECKOUT'}
                  onChange={() => setPaymentMethod('TEST_CHECKOUT')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-700" />
                    <span className="text-sm font-bold text-slate-900">Instant Test Card Checkout (Simulated)</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Simulates an instant successful digital payment.</p>
                </div>
              </label>
            </div>
          </section>

          {/* Step 3: Review Items & Delivery */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                3
              </span>
              <h2 className="text-lg font-bold text-slate-900">Review items and delivery</h2>
            </div>

            <ul className="mt-4 divide-y divide-slate-100">
              {lines.map((line) => (
                <li key={line.product.id} className="flex gap-4 py-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                    <ProductImage src={line.product.images[0]} alt={line.product.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-slate-900 line-clamp-1">{line.product.name}</p>
                    <p className="text-slate-500">Qty: {line.quantity}</p>
                    <p className="font-bold text-slate-900 mt-1">{formatINR(line.lineTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Order Summary Box */}
        <aside className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-44">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-500 disabled:opacity-50 shadow-sm"
          >
            {placingOrder ? 'Processing Order...' : 'Place Your Order'}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            By placing your order, you agree to Amazon Clone's simulated Privacy Notice and Conditions of Use.
          </p>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <dt>Items ({itemCount}):</dt>
                <dd className="font-semibold text-slate-900">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Delivery Charge:</dt>
                <dd className="font-semibold text-slate-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(deliveryCharge)}
                </dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Total Savings:</dt>
                  <dd className="font-bold">-{formatINR(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                <dt>Order Total:</dt>
                <dd className="text-base text-amber-700">{formatINR(total)}</dd>
              </div>
            </dl>
          </div>

          {selectedAddress && (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
              <p className="font-bold text-slate-800">Delivering to:</p>
              <p className="truncate font-medium text-slate-700">{selectedAddress.fullName}</p>
              <p className="truncate text-slate-500">
                {selectedAddress.street}, {selectedAddress.city}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

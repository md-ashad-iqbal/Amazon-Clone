import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban, Clock, MapPin, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';
import type { Order } from '@/types';
import { formatINR } from '@/utils/format';
import ProductImage from '@/components/common/ProductImage';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetails() {
  const { orderId } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=/orders/${orderId || ''}`);
      return;
    }

    if (!orderId) return;
    apiClient
      .get(`/orders/${orderId}`)
      .then((res) => {
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
        }
      })
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        toast.error(axiosErr.response?.data?.message || 'Could not load order.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, isAuthenticated, authLoading, navigate]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const res = await apiClient.put(`/orders/${order.orderId}/cancel`);
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        setOrder((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
      } else {
        toast.error(res.data.message || 'Failed to cancel order.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Could not cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <Package className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Order Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">We could not locate this order in your account.</p>
        <Link to="/orders" className="btn-primary mt-6 inline-block">
          View All Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const currentStepIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl py-4 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to all orders
        </Link>
        <span className="text-xs text-slate-500">Order # {order.orderId}</span>
      </div>

      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Order Details</h1>
            <p className="mt-1 text-xs text-slate-500">
              Ordered on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div>
            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                <Ban className="h-4 w-4" />
                Cancelled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                <Clock className="h-4 w-4" />
                {order.status}
              </span>
            )}
          </div>
        </div>

        {/* Progress Tracker (unless cancelled) */}
        {!isCancelled && (
          <div className="py-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Status</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                        isPassed ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        isCurrent ? 'font-bold text-slate-900' : isPassed ? 'text-slate-800 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-600">
              Estimated Delivery by: <strong className="text-slate-900">{order.estimatedDeliveryDate}</strong>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="my-4 rounded-xl bg-rose-50 p-4 text-xs text-rose-800 ring-1 ring-rose-200">
            <p className="font-bold">This order was cancelled.</p>
            <p className="mt-1">All reserved items have been restored to available inventory.</p>
          </div>
        )}

        {order.status === 'Processing' && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling Order...' : 'Cancel This Order'}
            </button>
          </div>
        )}
      </header>

      {/* Shipping & Payment Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Shipping Address */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-600" />
            Shipping Address
          </h2>
          <div className="mt-3 text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="mt-1 text-slate-500">Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Payment Information</h2>
          <div className="mt-3 text-xs text-slate-700 space-y-1">
            <p>
              <span className="font-medium text-slate-500">Method: </span>
              <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (Simulated)' : 'Instant Test Checkout (Simulated)'}</strong>
            </p>
            <p>
              <span className="font-medium text-slate-500">Payment Status: </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-800">
                {order.paymentStatus}
              </span>
            </p>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-semibold text-slate-800">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Shipping:</span>
              <span className="font-semibold text-slate-800">
                {order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}
              </span>
            </div>
            {order.savings > 0 && (
              <div className="flex justify-between py-0.5 text-emerald-700 font-bold">
                <span>Savings:</span>
                <span>-{formatINR(order.savings)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-amber-700">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-bold text-slate-900">Items Ordered ({order.items?.length})</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-4">
              <Link
                to={`/products/${item.productId}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200"
              >
                <ProductImage src={item.image} alt={item.name} className="h-full w-full object-contain" />
              </Link>
              <div className="flex-1 text-xs">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-bold text-slate-900 hover:text-sky-800 line-clamp-2 text-sm"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 text-slate-500">{item.brand}</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatINR(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">
                  {formatINR(item.price * item.quantity)}
                </p>
                <Link
                  to={`/products/${item.productId}`}
                  className="mt-2 inline-block rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-500"
                >
                  Buy Again
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

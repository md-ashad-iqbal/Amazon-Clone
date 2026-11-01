import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, CheckCircle2, ChevronRight, Package, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiClient } from '@/services/api';
import type { Order } from '@/types';
import { formatINR } from '@/utils/format';
import ProductImage from '@/components/common/ProductImage';
import toast from 'react-hot-toast';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/orders');
      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this simulated order?')) return;

    setCancellingId(orderId);
    try {
      const res = await apiClient.put(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: 'Cancelled' } : o))
        );
      } else {
        toast.error(res.data.message || 'Could not cancel order.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBuyAgain = (productId: string) => {
    const res = addItem(productId, 1);
    if (res === 'added') {
      toast.success('Added item to cart!');
    } else {
      toast.error('Item is currently out of stock.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <Package className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your Orders</h1>
        <p className="mt-2 text-sm text-slate-600">Please sign in to track and view your order history.</p>
        <Link to="/login?redirect=/orders" className="btn-primary mt-6 inline-block w-full">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] py-4">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-500">
            <Link to="/account" className="hover:underline">Your Account</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800 font-medium">Your Orders</span>
          </nav>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Your Orders</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">No orders placed yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Looking for something? Browse thousands of products across our top categories.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancelled = order.status === 'Cancelled';
            const isDelivered = order.status === 'Delivered';
            const isProcessing = order.status === 'Processing';

            return (
              <div
                key={order.orderId}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                {/* Order Top Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-6 py-4 text-xs text-slate-600 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <span className="block uppercase text-[10px] font-bold text-slate-400">Order Placed</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="block uppercase text-[10px] font-bold text-slate-400">Total</span>
                      <span className="font-bold text-slate-900">{formatINR(order.total)}</span>
                    </div>

                    <div>
                      <span className="block uppercase text-[10px] font-bold text-slate-400">Ship To</span>
                      <span className="font-semibold text-sky-800 underline cursor-pointer">
                        {order.shippingAddress?.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block uppercase text-[10px] font-bold text-slate-400">Order # {order.orderId}</span>
                    <Link
                      to={`/orders/${order.orderId}`}
                      className="font-bold text-sky-700 hover:text-amber-700 hover:underline"
                    >
                      View order details
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Status Banner */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCancelled ? (
                        <Ban className="h-5 w-5 text-rose-600" />
                      ) : isDelivered ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Truck className="h-5 w-5 text-amber-600" />
                      )}
                      <div>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-800'
                              : isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        {!isCancelled && (
                          <span className="ml-2 text-xs text-slate-600">
                            Estimated delivery: <strong className="text-slate-800">{order.estimatedDeliveryDate}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {isProcessing && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={cancellingId === order.orderId}
                        className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {cancellingId === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>

                  {/* Item List */}
                  <div className="space-y-4 divide-y divide-slate-100">
                    {order.items?.map((item) => (
                      <div key={item.productId} className="flex flex-wrap items-center justify-between gap-4 pt-3">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/products/${item.productId}`}
                            className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200"
                          >
                            <ProductImage src={item.image} alt={item.name} className="h-full w-full object-contain" />
                          </Link>
                          <div>
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-sm font-bold text-slate-900 hover:text-sky-800 line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-slate-500">{item.brand}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-800">
                              Qty: {item.quantity} × {formatINR(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleBuyAgain(item.productId)}
                            className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-500 shadow-xs"
                          >
                            Buy it again
                          </button>
                          <Link
                            to={`/products/${item.productId}`}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            View item
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

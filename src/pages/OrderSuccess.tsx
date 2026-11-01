import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Truck } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { Order } from '@/types';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    apiClient
      .get(`/orders/${orderId}`)
      .then((res) => {
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
        }
      })
      .catch(() => {
        // Fallback placeholder if offline
      });
  }, [orderId]);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-4 text-2xl font-black text-slate-900">Order Placed, Thank You!</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your simulated demo order has been placed successfully.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-xs ring-1 ring-slate-200">
          <div className="flex flex-wrap justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="font-semibold text-slate-500">Order ID:</span>
              <p className="font-bold text-slate-900 text-sm">{orderId}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Estimated Delivery:</span>
              <p className="font-bold text-slate-900 text-sm">
                {order?.estimatedDeliveryDate || 'Within 2-4 Business Days'}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-slate-700">
            <Truck className="h-4 w-4 text-amber-600" />
            <span>We've registered your simulated order. You can track status anytime.</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${orderId}`}
            className="rounded-lg bg-amber-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-500 shadow-sm"
          >
            View Order Details
          </Link>
          <Link
            to="/orders"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

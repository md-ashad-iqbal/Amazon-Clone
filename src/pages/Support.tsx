import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'faqs',
    title: 'Frequently asked questions',
    body: (
      <>
        <p><span className="font-semibold text-slate-900">Is this a real store?</span> No. ShopSphere is a learning demo. No real orders are placed and no payment is taken.</p>
        <p><span className="font-semibold text-slate-900">Where is my cart saved?</span> Your cart and wishlist are kept in this browser, so they stay after you reload.</p>
      </>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping information',
    body: (
      <p>Orders at or above Rs. 499 ship free. Smaller carts carry a flat delivery charge of Rs. 49. Estimated delivery dates are shown on each product.</p>
    ),
  },
  {
    id: 'returns',
    title: 'Returns and refund policy',
    body: (
      <p>Eligible items can be returned within 10 days of delivery. Demo orders are simulated, so no physical return is needed.</p>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    body: (
      <p>This demo does not collect personal data beyond what your browser stores locally for the cart, wishlist and recently viewed items.</p>
    ),
  },
  {
    id: 'terms',
    title: 'Terms and conditions',
    body: (
      <p>All products, prices and reviews on this site are sample data created for demonstration purposes.</p>
    ),
  },
];

export default function Support() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="rounded-2xl bg-navy-900 p-8 text-white shadow-lift">
        <h1 className="text-3xl font-bold">Customer Service</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">
          Find answers about shipping, returns and how this demo store works, or reach out to our team.
        </p>
      </header>

      <section id="contact" className="scroll-mt-44 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
          <Mail className="h-6 w-6 text-sky-700" />
          <h2 className="mt-3 text-base font-bold text-slate-900">Email us</h2>
          <p className="mt-1 text-sm text-slate-600">support@shopsphere.example</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
          <Phone className="h-6 w-6 text-sky-700" />
          <h2 className="mt-3 text-base font-bold text-slate-900">Call us</h2>
          <p className="mt-1 text-sm text-slate-600">Mon to Sat, 9 AM to 6 PM IST</p>
        </div>
      </section>

      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-44 space-y-3 rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-card ring-1 ring-slate-200/70"
        >
          <h2 className="section-title">{section.title}</h2>
          {section.body}
        </section>
      ))}

      <Link to="/products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}

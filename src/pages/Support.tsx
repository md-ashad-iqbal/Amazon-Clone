import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'about',
    title: 'About Amazon Clone',
    body: (
      <p>
        Amazon Clone is an educational e-commerce project built to demonstrate modern full-stack web engineering,
        including reactive state management, product discovery, simulated payment flows, and order tracking.
      </p>
    ),
  },
  {
    id: 'faqs',
    title: 'Frequently asked questions',
    body: (
      <>
        <p><span className="font-semibold text-slate-900">Is this an official store?</span> No. Amazon Clone is an educational project inspired by Amazon. No real transactions take place and no real cards are charged.</p>
        <p><span className="font-semibold text-slate-900">Where is my cart saved?</span> Your cart, wishlist, and recent views persist securely in your browser session and user account.</p>
      </>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping information',
    body: (
      <p>Orders at or above ₹499 qualify for FREE simulated delivery. Smaller orders include standard delivery of ₹49. Realistic estimated delivery dates are calculated per department.</p>
    ),
  },
  {
    id: 'returns',
    title: 'Returns and refund policy',
    body: (
      <p>Eligible items feature simulated 10-day replacement guarantees. Demo cancellations restock reserved items immediately back to the store inventory.</p>
    ),
  },
  {
    id: 'sell',
    title: 'Selling and partner programs',
    body: (
      <p>Explore mock merchant tools and seller accelerator resources designed for educational walkthroughs and e-commerce training.</p>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy notice',
    body: (
      <p>This educational application prioritizes user security. Passwords are encrypted with bcrypt and JWT tokens authenticate sessions safely.</p>
    ),
  },
  {
    id: 'terms',
    title: 'Conditions of use and sale',
    body: (
      <p>All product catalogues, brands, prices, and reviews on this website are sample demo data presented strictly for learning and architectural demonstration.</p>
    ),
  },
];

export default function Support() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="rounded-2xl bg-navy-900 p-8 text-white shadow-lift">
        <h1 className="text-3xl font-bold">Customer Service &amp; Help</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">
          Find answers about delivery, order tracking, returns and how this Amazon Clone demo store functions, or contact our support team.
        </p>
      </header>

      <section id="contact" className="scroll-mt-44 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
          <Mail className="h-6 w-6 text-sky-700" />
          <h2 className="mt-3 text-base font-bold text-slate-900">Email support</h2>
          <p className="mt-1 text-sm text-slate-600">support@amazonclone.example</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
          <Phone className="h-6 w-6 text-sky-700" />
          <h2 className="mt-3 text-base font-bold text-slate-900">Phone helpline</h2>
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

      <div className="pt-2">
        <Link to="/products" className="btn-primary inline-flex">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70">
      <SearchX className="mx-auto h-12 w-12 text-slate-400" />
      <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-sky-800">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">We could not find that page</h1>
      <p className="mt-2 text-sm text-slate-600">The link may be broken or the page may have moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}

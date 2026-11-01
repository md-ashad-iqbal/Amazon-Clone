import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, Tag, User, X } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { useAuth } from '@/context/AuthContext';

const linkClass =
  'whitespace-nowrap px-3 py-2 text-xs md:text-sm font-medium text-slate-100 transition hover:text-amber-300 hover:ring-1 hover:ring-white/80 rounded-sm';

export default function CategoryNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Close drawer on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <>
      <nav aria-label="Categories" className="bg-[#232f3e] text-white">
        <div className="scrollbar-hide mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-3 py-1 md:px-5">
          {/* Hamburger "All" Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-bold text-white transition hover:ring-1 hover:ring-white md:text-sm"
          >
            <Menu className="h-4 w-4" />
            <span>All</span>
          </button>

          <Link to="/products?deals=1" className={`${linkClass} flex items-center gap-1 font-semibold text-amber-300`}>
            <Tag className="h-3.5 w-3.5 text-amber-400" />
            Today's Deals
          </Link>

          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              to={`/products?category=${category.key}`}
              className={linkClass}
            >
              {category.label}
            </Link>
          ))}

          <Link to="/support" className={linkClass}>
            Customer Service
          </Link>

          <Link to="/products?sort=bestseller" className={linkClass}>
            Best Sellers
          </Link>

          <Link to="/support#faqs" className={`${linkClass} hidden lg:inline-block`}>
            Registry
          </Link>

          <Link to="/support#faqs" className={`${linkClass} hidden lg:inline-block`}>
            Gift Cards
          </Link>

          <Link to="/support#contact" className={`${linkClass} hidden xl:inline-block`}>
            Sell
          </Link>
        </div>
      </nav>

      {/* Slide-out Sidebar Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white text-slate-900 shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between bg-[#232f3e] px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white">
                  <User className="h-5 w-5" />
                </span>
                <span className="text-base font-bold">
                  Hello, {isAuthenticated && user ? user.name.split(' ')[0] : 'Sign in'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-1 text-slate-300 hover:bg-slate-700 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Trending */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Trending</h3>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link
                      to="/products?sort=bestseller"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      <span>Best Sellers</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products?deals=1"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      <span>Today's Deals</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products?sort=newest"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      <span>New Releases</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Shop by Department */}
              <div className="border-b border-slate-200 py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Shop by Department
                </h3>
                <ul className="mt-2 space-y-1">
                  {CATEGORIES.map((category) => (
                    <li key={category.key}>
                      <Link
                        to={`/products?category=${category.key}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      >
                        <span>{category.label}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help & Settings */}
              <div className="py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Help & Settings
                </h3>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link
                      to="/account"
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      Your Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      Your Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      Customer Service
                    </Link>
                  </li>
                  {!isAuthenticated ? (
                    <li>
                      <Link
                        to="/login"
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-md px-2 py-2 text-sm font-semibold text-amber-600 hover:bg-slate-100"
                      >
                        Sign in
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to="/account"
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-md px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Manage Profile
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

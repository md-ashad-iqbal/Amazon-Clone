import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, LogOut, MapPin, Package, ShoppingBag, ShoppingCart, User, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import DeliverTo from '@/components/layout/DeliverTo';
import SearchBar from '@/components/layout/SearchBar';
import CategoryNav from '@/components/layout/CategoryNav';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setAccountMenuOpen(false);
    logout();
    navigate('/');
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Sign in';

  return (
    <header className="sticky top-0 z-40 text-white shadow-md">
      {/* Primary Top Bar */}
      <div className="bg-[#131921]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2.5 sm:gap-x-4 md:px-5">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-1.5 rounded-sm p-1.5 transition hover:ring-1 hover:ring-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-[#131921] shadow-sm">
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-white">
                Shop<span className="text-amber-400">Sphere</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider">.in</span>
            </div>
          </Link>

          {/* Delivery Location Selector */}
          <DeliverTo />

          {/* Centered Search Bar */}
          <div className="order-3 w-full md:order-none md:flex-1 md:px-2">
            <SearchBar />
          </div>

          {/* Right Navigation Controls */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Country / Language Indicator */}
            <div className="hidden cursor-pointer items-center gap-1 rounded-sm p-1.5 text-xs font-bold transition hover:ring-1 hover:ring-white lg:flex">
              <span className="text-base" role="img" aria-label="India flag">🇮🇳</span>
              <span>EN</span>
            </div>

            {/* Account & Lists Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                onMouseEnter={() => setAccountMenuOpen(true)}
                className="flex items-center gap-1 rounded-sm p-1.5 text-left transition hover:ring-1 hover:ring-white"
                aria-expanded={accountMenuOpen}
              >
                <div className="text-left">
                  <span className="block text-[11px] leading-tight text-slate-300">
                    Hello, {isAuthenticated ? firstName : 'sign in'}
                  </span>
                  <span className="block text-xs font-bold leading-tight sm:text-sm">
                    Account & Lists
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md bg-white p-4 text-slate-900 shadow-2xl ring-1 ring-slate-900/10"
                >
                  {!isAuthenticated ? (
                    <div className="border-b border-slate-200 pb-3 text-center">
                      <Link
                        to="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block w-full rounded-md bg-amber-400 py-2 text-center text-sm font-bold text-slate-950 transition hover:bg-amber-500 shadow-sm"
                      >
                        Sign in
                      </Link>
                      <p className="mt-2 text-xs text-slate-600">
                        New customer?{' '}
                        <Link
                          to="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="font-semibold text-sky-700 hover:underline"
                        >
                          Start here.
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="border-b border-slate-200 pb-3">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                  )}

                  <div className="py-2">
                    <p className="px-2 text-xs font-bold text-slate-900 uppercase tracking-wider">Your Account</p>
                    <ul className="mt-1 space-y-0.5 text-sm">
                      <li>
                        <Link
                          to="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-amber-700"
                        >
                          <User className="h-4 w-4 text-slate-500" />
                          Your Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-amber-700"
                        >
                          <Package className="h-4 w-4 text-slate-500" />
                          Your Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/addresses"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-amber-700"
                        >
                          <MapPin className="h-4 w-4 text-slate-500" />
                          Saved Addresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-amber-700"
                        >
                          <Heart className="h-4 w-4 text-slate-500" />
                          Your Wishlist ({productIds.length})
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {isAuthenticated && (
                    <div className="border-t border-slate-200 pt-2">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders Link */}
            <Link
              to="/orders"
              className="hidden rounded-sm p-1.5 text-left transition hover:ring-1 hover:ring-white sm:block"
            >
              <span className="block text-[11px] leading-tight text-slate-300">Returns</span>
              <span className="block text-xs font-bold leading-tight sm:text-sm">& Orders</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${productIds.length} items`}
              className="relative hidden items-center gap-1.5 rounded-sm p-1.5 text-sm font-semibold transition hover:ring-1 hover:ring-white md:flex"
            >
              <span className="relative">
                <Heart className="h-6 w-6" />
                {productIds.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950">
                    {productIds.length}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline text-xs font-bold">Wishlist</span>
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              aria-label={`Cart, ${itemCount} items`}
              className="relative flex items-end gap-1 rounded-sm p-1.5 transition hover:ring-1 hover:ring-white"
            >
              <span className="relative">
                <ShoppingCart className="h-7 w-7 text-white" />
                <span className="absolute -right-1 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-black text-slate-950 shadow-sm">
                  {itemCount}
                </span>
              </span>
              <span className="hidden text-sm font-bold sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Category Sub-navigation */}
      <CategoryNav />
    </header>
  );
}

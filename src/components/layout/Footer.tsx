import { Link } from 'react-router-dom';
import { ArrowUp, Globe, ShoppingBag } from 'lucide-react';

const columnHeading = 'mb-3 text-base font-bold text-white';
const columnLink = 'block py-1 text-[13px] text-slate-300 transition hover:text-amber-300 hover:underline';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#232f3e] text-slate-300">
      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="flex w-full items-center justify-center gap-2 bg-[#37475a] py-3.5 text-xs font-semibold text-white transition hover:bg-[#485769]"
      >
        <ArrowUp className="h-4 w-4" />
        Back to top
      </button>

      {/* Main 4-column directory */}
      <div className="mx-auto max-w-[1300px] px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h3 className={columnHeading}>Get to Know Us</h3>
            <ul className="space-y-1">
              <li><Link to="/support#about" className={columnLink}>About ShopSphere</Link></li>
              <li><Link to="/support" className={columnLink}>Careers</Link></li>
              <li><Link to="/support" className={columnLink}>Press Releases</Link></li>
              <li><Link to="/support" className={columnLink}>ShopSphere Science</Link></li>
              <li><Link to="/support" className={columnLink}>Investor Relations</Link></li>
              <li><Link to="/support" className={columnLink}>ShopSphere Devices</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className={columnHeading}>Make Money with Us</h3>
            <ul className="space-y-1">
              <li><Link to="/support#sell" className={columnLink}>Sell on ShopSphere</Link></li>
              <li><Link to="/support#sell" className={columnLink}>Sell under ShopSphere Accelerator</Link></li>
              <li><Link to="/support" className={columnLink}>Protect and Build Your Brand</Link></li>
              <li><Link to="/support" className={columnLink}>ShopSphere Global Selling</Link></li>
              <li><Link to="/support" className={columnLink}>Become an Affiliate</Link></li>
              <li><Link to="/support" className={columnLink}>Fulfilment by ShopSphere</Link></li>
              <li><Link to="/support" className={columnLink}>Advertise Your Products</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className={columnHeading}>ShopSphere Payment</h3>
            <ul className="space-y-1">
              <li><Link to="/support" className={columnLink}>ShopSphere Pay</Link></li>
              <li><Link to="/support" className={columnLink}>ShopSphere Business Card</Link></li>
              <li><Link to="/support" className={columnLink}>Shop with Points</Link></li>
              <li><Link to="/support" className={columnLink}>Reload Your Balance</Link></li>
              <li><Link to="/support" className={columnLink}>ShopSphere Currency Converter</Link></li>
              <li><Link to="/support" className={columnLink}>Cash on Delivery (Simulated)</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className={columnHeading}>Let Us Help You</h3>
            <ul className="space-y-1">
              <li><Link to="/account" className={columnLink}>Your Account</Link></li>
              <li><Link to="/orders" className={columnLink}>Your Orders</Link></li>
              <li><Link to="/support#shipping" className={columnLink}>Shipping Rates & Policies</Link></li>
              <li><Link to="/support#returns" className={columnLink}>Returns & Replacements</Link></li>
              <li><Link to="/support" className={columnLink}>Manage Your Content and Devices</Link></li>
              <li><Link to="/support#faqs" className={columnLink}>Help & Customer Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Brand and Selectors Divider */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-[#3a4553] pt-8">
          <Link to="/" className="flex items-center gap-1.5 text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-400 text-slate-950 font-black">
              <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold">
              Shop<span className="text-amber-400">Sphere</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-slate-300">
              <Globe className="h-3.5 w-3.5" />
              <span>English</span>
            </div>

            {/* Currency Selector */}
            <div className="rounded border border-slate-500 px-3 py-1.5 text-slate-300">
              <span>₹ INR - Indian Rupee</span>
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-slate-300">
              <span role="img" aria-label="India flag">🇮🇳</span>
              <span>India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Navy Bottom Services Directory */}
      <div className="bg-[#131a22] py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-[1300px] px-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 md:grid-cols-5">
            <div>
              <p className="font-bold text-slate-200">ShopSphere Music</p>
              <p className="text-[11px] text-slate-500">Stream millions of songs</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">ShopSphere Ads</p>
              <p className="text-[11px] text-slate-500">Reach customers everywhere</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Cloud Services</p>
              <p className="text-[11px] text-slate-500">Scalable cloud computing</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Audible</p>
              <p className="text-[11px] text-slate-500">Listen to audiobooks</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Prime Video</p>
              <p className="text-[11px] text-slate-500">Movies & TV shows</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Goodreads</p>
              <p className="text-[11px] text-slate-500">Book reviews & recommendations</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">IMDb</p>
              <p className="text-[11px] text-slate-500">Movies, TV & Celebrities</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">ShopSphere Business</p>
              <p className="text-[11px] text-slate-500">Everything for your business</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">ShopSphere Global</p>
              <p className="text-[11px] text-slate-500">Ship orders internationally</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Ring</p>
              <p className="text-[11px] text-slate-500">Smart home security</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/support#terms" className="hover:text-slate-300 hover:underline">Conditions of Use & Sale</Link>
              <Link to="/support#privacy" className="hover:text-slate-300 hover:underline">Privacy Notice</Link>
              <Link to="/support" className="hover:text-slate-300 hover:underline">Interest-Based Ads</Link>
            </div>
            <p className="mt-2">
              © 2026 ShopSphere. Educational demo marketplace inspired by Amazon. All trademarks and registered brands belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

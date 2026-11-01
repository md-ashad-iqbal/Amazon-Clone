import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Account from '@/pages/Account';
import Addresses from '@/pages/Addresses';
import Cart from '@/pages/Cart';
import CategoryPage from '@/pages/CategoryPage';
import Checkout from '@/pages/Checkout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import OrderDetails from '@/pages/OrderDetails';
import Orders from '@/pages/Orders';
import OrderSuccess from '@/pages/OrderSuccess';
import ProductDetails from '@/pages/ProductDetails';
import Products from '@/pages/Products';
import Register from '@/pages/Register';
import Search from '@/pages/Search';
import Support from '@/pages/Support';
import Wishlist from '@/pages/Wishlist';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="category/:categoryKey" element={<CategoryPage />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

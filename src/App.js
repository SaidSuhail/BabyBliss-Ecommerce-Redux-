import './App.css';
import Registration from './Pages/Registration';
import { Route, Routes,useLocation } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Navbar from './Components/Navbar';
import Fashion from './Pages/Fashion';
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/Checkout';
import BillingPage from './Pages/BillingPage';
import PaymentConfirmation from './Pages/PaymentConfirmation';
import OrderConfirmation from './Pages/OrderConfirmation';
import ProductDetail from './Pages/ProductDetail';
import MyOrder from './Pages/MyOrder';
import Footer from './Components/Footer';
import Admin from './Admin/Admin';
import UserSection from './Admin/UserSection'
import ProductSection from './Admin/ProductSection'
import Dashboard from './Admin/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './app/store';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    
    <div className="App">
      <Provider store={store}>
      {!isAuthPage &&  !isAdminRoute &&<Navbar />}
      <Routes>
        {/* {user routes} */}
        <Route path='/register' element={<div><Registration/></div>}/>
        <Route path='/login' element={<div><Login/></div>}/>
        <Route path='/' element={<div><Home/></div>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/fashion' element={<Fashion/>}/>
        <Route path="/fashion/:productId" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/order-confirmation" element={<OrderConfirmation/>} /> 
        <Route path="/my-orders" element={<MyOrder/>} /> 
         {/* Admin Routes (wrapped inside AdminLayout) */}
         <Route path="/admin/*" element={<ProtectedRoute component={Admin} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-section" element={<UserSection />} />
            <Route path="product-section" element={<ProductSection />} />
          </Route>
      </Routes>
      {!isAuthPage &&!isAdminRoute && <Footer />}
      </Provider>
      <ToastContainer /> 
    </div>
  );
}

export default App;

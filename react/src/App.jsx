import { useEffect, useState } from "react";
import Home from "./components/home/home";
import { BrowserRouter as Router, Route, Routes, Navigate, Link ,ScrollRestoration} from "react-router-dom";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import Forgot from "./components/forgot/forgot";
import Inside from "./components/inside/inside";
import Cookies from 'js-cookie';
import Purchase from "./components/purchase/purchase";
import Address from "./components/address/address";
import Orders from "./components/orders/Orders";
import BuyNow from "./components/buyNow/buyNow";
import ResultPage from "./components/search/resultPage";
import Dashboard from "./components/dashboard/main/dashboard";
import AddProduct from "./components/dashboard/sub-pages/addProduct/addProduct";
import ResetPass from "./components/forgot/resetPass";
import Profile from "./components/profile/profile";
import { UserProvider } from "./components/authentication/userContext";
import AuthPage from "./components/authPage/authPage";
import { WishlistProvider } from "./components/wishlist/wishlistContext";
import OrderView from "./components/orders/OrderView";
import AdminAuth from "./components/dashboard/auth/adminAuth";
import DashboardBody from "./components/dashboard/main/dashboardBody";
import AdminUsers from "./components/dashboard/pages/adminUsers"
import AdminProducts from "./components/dashboard/pages/adminProducts";
import AdminOrders from "./components/dashboard/pages/adminOrders";




function App() {
  
  const isLogged=()=>{
    if(Cookies.get('userKey'))
      {
        return true;
      }
      else
      {
        return false;
      }
  }
  const isAdmin=()=>{
    return !!Cookies.get('adminLogged');
  }

  const isOtpVerified=()=>{
    return !!Cookies.get('otpVerified');
  }

  const adminLogged=isAdmin();
  const logged=isLogged();
  const resetUser=isOtpVerified();

  return (
    <UserProvider>
    <WishlistProvider>
    <Router>
      <Routes>
      
        <Route path="/" element={(adminLogged?<Navigate to={'/admin'}/>:<Inside/>)}/>
        <Route path="/login" element={(logged?<Inside/>:<Home />)}/>
        <Route path="/forgot" element={(logged?<Inside/>:<Forgot />)}/>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/test" element={<Inside/>}/> */}
        <Route path="/purchase" element={<Purchase/>}/>
        <Route path="/result" element={<ResultPage/>}/>
        <Route path="/address" element={(logged?<Address/>:<AuthPageWithPopup/>)}/>
        <Route path="/orders" element={(logged?<Orders/>:<AuthPageWithPopup/>)}/>
        <Route path="/orderView" element={(logged?<OrderView/>:<AuthPageWithPopup/>)}/>
        <Route path="/buyNow" element={(logged?<BuyNow/>:<AuthPageWithPopup/>)}/>
        <Route path="/profile" element={(logged?<Profile/>:<AuthPageWithPopup/>)}/>
        <Route path="/admin" element={adminLogged?<Dashboard/>:<AdminAuth/>}>
          <Route index element={<DashboardBody />} />
          <Route path="addProduct" element={<AddProduct/>}/>
          <Route path="users" element={<AdminUsers/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="*" element={<Navigate to={'/admin'}/>}/>
        </Route>
        <Route path='/resetPass' element={resetUser?<ResetPass/>:<Forgot/>}/>

      </Routes>
    </Router>
    </WishlistProvider>
    </UserProvider>
  );
}

const AuthPageWithPopup = () => {
  const [showHomePopup, setShowHomePopup] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setShowHomePopup(true);
  }, []);

  const closePopupAndRedirect = () => {
    setShowHomePopup(false);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {showHomePopup ? <AuthPage close={closePopupAndRedirect}  /> : <Inside />}
    </>
  );
};

export default App;

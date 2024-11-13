import { useEffect, useState } from "react";
import Home from "./components/home/home";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Forgot from "./components/forgot/forgot";
import Inside from "./components/inside/inside";
import Cookies from 'js-cookie';
import Purchase from "./components/purchase/purchase";
import Address from "./components/address/address";
import Orders from "./components/orders/Orders";
import BuyNow from "./components/buyNow/buyNow";
import Dashboard from "./components/dashboard/dashboard";
import AddProduct from "./components/addProduct/addProduct";
import ViewProduct from "./components/viewProduct/viewProduct";
import DeleteProduct from "./components/deleteProduct/deleteProduct";
import ResetPass from "./components/forgot/resetPass";
import Profile from "./components/profile/profile";
import { UserProvider } from "./components/authentication/userContext";
import AuthPage from "./components/authPage/authPage";
import { WishlistProvider } from "./components/wishlist/wishlistContext";


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
        
        <Route path="/" element={(adminLogged?<Dashboard/>:<Inside/>)}/>
        <Route path="/login" element={(logged?<Inside/>:<Home />)}/>
        <Route path="/forgot" element={(logged?<Inside/>:<Forgot />)}/>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/test" element={<Inside/>}/> */}
        <Route path="/purchase" element={<Purchase/>}/>
        <Route path="/address" element={(logged?<Address/>:<AuthPageWithPopup/>)}/>
        <Route path="/orders" element={(logged?<Orders/>:<AuthPageWithPopup/>)}/>
        <Route path="/buyNow" element={(logged?<BuyNow/>:<AuthPageWithPopup/>)}/>
        <Route path="/profile" element={(logged?<Profile/>:<AuthPageWithPopup/>)}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/addProduct" element={adminLogged?<AddProduct/>:<Dashboard/>}/>
        <Route path="/viewProduct" element={adminLogged?<ViewProduct/>:<Dashboard/>}/>
        <Route path="/deleteProduct" element={adminLogged?<DeleteProduct/>:<Dashboard/>}/>
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

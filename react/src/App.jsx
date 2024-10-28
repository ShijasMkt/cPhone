import { useState } from "react";
import Home from "./components/home/home";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
  console.log(adminLogged)
  return (
    
    <Router>
      <Routes>
        
        <Route path="/" element={logged?<Inside/>:(adminLogged?<Dashboard/>:<Home/>)}/>
        <Route path="/forgot" element={logged?<Navigate to="/"/>:<Forgot />}/>
        <Route path="/inside" element={logged?<Inside />:<Home/>}/>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/test" element={<Inside/>}/> */}
        <Route path="/purchase" element={logged?<Purchase/>:<Home/>}/>
        <Route path="/address" element={logged?<Address/>:<Home/>}/>
        <Route path="/orders" element={logged?<Orders/>:<Home/>}/>
        <Route path="/buyNow" element={logged?<BuyNow/>:<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/addProduct" element={adminLogged?<AddProduct/>:<Dashboard/>}/>
        <Route path="/viewProduct" element={adminLogged?<ViewProduct/>:<Dashboard/>}/>
        <Route path="/deleteProduct" element={adminLogged?<DeleteProduct/>:<Dashboard/>}/>
        <Route path='/resetPass' element={resetUser?<ResetPass/>:<Forgot/>}/>



      </Routes>
    </Router>
  );
}

export default App;

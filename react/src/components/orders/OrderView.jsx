import React, { useEffect } from 'react'
import { json, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SecNav from '../secNav/secNav';
import "./orderView.css"

export default function OrderView() {
    const location = useLocation();
    const fromOrders = location.state?.fromOrders;
    const orderData=location.state?.data;
    const deliveryStatus=location.state?.deliveryStatus;

    // useEffect(()=>{
    //    console.log(location.state) 
    // },[])
    
    const orderID=orderData.orderID
    if (!fromOrders) {
        return <Navigate to="/orders" />;
    }

    const downloadInvoice=async()=>{
        const body = JSON.stringify({ orderID});
        const res = await fetch("http://127.0.0.1:8000/invoice/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body,
        });
    }
  return (
    <>
       <SecNav/>
       <div className="order-view-body pt-top">
        <div className="container">
            <div className="delivery-section">
                <span>#{orderID}</span>
                <div className="row">
                    <div className="col-6">
                        <div className="delivery-address">
                            <h5 className='mb-3'>Delivery Address</h5>
                            <div>{orderData.address.fname} {orderData.address.lname}</div>
                            <div>{orderData.address.address}-{orderData.address.pincode}</div>
                            <div>Phone number: {orderData.address.mobile}</div>
                            
                        </div>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div className='order-delivery-status'>
                            <div className='delivery-status-elements'>Delivery Status: <span style={{color: deliveryStatus==="In Progress"?"orange":"green"}}>{deliveryStatus}</span></div>
                            <div className='delivery-status-elements'>Download Invoice: <button type="button" className="download-btn" onClick={downloadInvoice}>Download</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="item-section">

            </div>
        </div>
       </div>
    </>
  )
}

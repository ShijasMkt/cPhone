import React, { useEffect,useState } from 'react'
import SecNav from '../secNav/secNav'
import "./orders.css"
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Footer from '../../footer/footer';

export default function Orders() {
  const navigateTo=useNavigate();
  const userID = Cookies.get("userID");
  const [orderData, setOrderData] = useState([]);
  useEffect(()=>{
    fetchOrders()  
  },[])

 

 

  const fetchOrders=async()=>{
    const body = JSON.stringify({ userID });
    const res = await fetch("http://127.0.0.1:8000/fetch_orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if(res.ok){
      const data = await res.json();
      setOrderData(data);
    }
  }
  const orderViewPage=(order)=>{
    navigateTo("/orderView",{ state: { fromOrders: true , data:order}});
  }
  return (
    <div>
      <SecNav/>
      <div className="orders-body pt-top">
        <div className="container">
        
        {orderData?(
          <div className="order-details-section">
            {orderData.map((order)=>(
              <div key={order.orderID} className="order-item-box" onClick={()=>orderViewPage(order)}>
              <div className="row">
                  <div className="col-2 d-flex justify-content-center">
                    <img 
                      src={`http://127.0.0.1:8000${order.item.img}`}
                      alt=""
                      width={60}
                    />
                  </div>
                  <div className="col-4">
                    <div className='order-item-name'>{order.item.name} <span>{order.item.desc.split('\n')[0]}</span> </div>
                  </div>
                  <div className="col-2">₹{order.price}</div>
                  <div className="col-4">
                    <div className='delivery-status'><div className='d-flex gap-2'>{order.status=="Shipped"?(<>&#128666;</>):(<>&#128230;</>)}{order.status}</div>
                    <span>{order.status=="Shipped"?(<>Your item will be delivered soon!</>):(<>Your item has been delivered </>)}</span>
                    </div>
                  </div>
              </div>
            </div>
            ))}
          
        </div>):(<>
        
        </>)}
        
        </div>
        
      </div>
      <Footer />
    </div>
  )
}

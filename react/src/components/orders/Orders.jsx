import React, { useEffect,useState } from 'react'
import SecNav from '../secNav/secNav'
import "./orders.css"
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigateTo=useNavigate();
  const userID = Cookies.get("userID");
  const [orderData, setOrderData] = useState([]);
  const [deliveryStatus,setDeliveryStatus]=useState({})
  useEffect(()=>{
    fetchOrders()  
  },[])

  useEffect(()=>{
    if(orderData){
      checkDeliveryStatus()
    }
  },[orderData])

  function getDate() {
		const today = new Date();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = today.getFullYear();
		const date = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${date}`;
	}

  const checkDeliveryStatus = () => {
    const statuses = {};
    const dateToday = new Date(getDate());

    orderData.forEach((order) => {
      const orderDate = new Date(order.date);
      const diffInTime = dateToday.getTime() - orderDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      statuses[order.orderID] = diffInDays >= 3 ? 'Delivered' : 'In Progress';
    });

    setDeliveryStatus(statuses);
  };

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
    navigateTo("/orderView",{ state: { fromOrders: true , data:order, deliveryStatus: deliveryStatus[order.orderID]}});
  }
  return (
    <div>
      <SecNav/>
      <div className="orders-body pt-top">
        <div className="container">
        <div className="search-section d-flex">
        <input className="search-bar" type="search" placeholder="Search your orders here" />
        <button type='button' className='search-btn'>
          <span className="material-symbols-outlined">search</span>Search Orders
        </button>
        </div>
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
                    <div className='delivery-status'><div className='d-flex gap-2'>{deliveryStatus[order.orderID]=="In Progress"?(<>&#128666;</>):(<>&#128230;</>)}{deliveryStatus[order.orderID]}</div>
                    <span>{deliveryStatus[order.orderID]=="In Progress"?(<>Your item will be delivered soon!</>):(<>Your item has been delivered </>)}</span>
                    </div>
                  </div>
              </div>
            </div>
            ))}
          
        </div>):(<></>)}
        
        </div>
        
      </div>
    </div>
  )
}

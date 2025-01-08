import React, { useEffect } from 'react'
import { json, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SecNav from '../secNav/secNav'; 
import { Timeline } from 'primereact/timeline';
import "./orderView.css"
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import Footer from '../../footer/footer';
        

export default function OrderView() {
    const location = useLocation();
    const fromOrders = location.state?.fromOrders;
    const orderData=location.state?.data;

   
    const events = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#FFFFFF',},
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#FFFFFF' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FFFFFF' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#FFFFFF' }
    ]
    
    const orderID=orderData.orderID
    if (!fromOrders) {
        return <Navigate to="/orders" />;
    }

    const downloadInvoice=async()=>{
        try {
            const response = await fetch(`http://127.0.0.1:8000/invoice/${orderID}/`, {
                method: "GET",
                headers: {
					"Content-Type": "application/pdf",
				},
            });
            
            const invoiceID=100+parseInt(orderID)
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Invoice_${invoiceID}.pdf`; 
            document.body.appendChild(a);

            a.click(); 

            window.URL.revokeObjectURL(url);

            document.body.removeChild(a);
    
            if (!response.ok) {
                throw new Error('Error fetching invoice');
            }
    
            
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    }

    const getConnectorClass = (status) => {
        const statuses = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
        const currentIndex = statuses.indexOf(orderData.status);
        const eventIndex = statuses.indexOf(status);

        return eventIndex <= currentIndex ? 'completed-connector' : 'pending-connector';
    };

    const getStatusClass = (status) => {
        const statuses = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
        const currentIndex = statuses.indexOf(orderData.status);
        const eventIndex = statuses.indexOf(status);

        return eventIndex <= currentIndex ? 'highlighted' : '';
    };


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
                            <div className='delivery-status-elements'>Delivery Status: <span style={{color: orderData.status==="Shipped"?"orange":"green"}}>{orderData.status}</span></div>
                            <div className='delivery-status-elements'>Download Invoice: <button type="button" className="download-btn" onClick={downloadInvoice}>Download</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="item-section">
                <div className="row">
                    <div className="col-4">
                        <div className="order-item-view">
                        <img 
                            src={`http://127.0.0.1:8000${orderData.item.img}`}
                            alt=""
                            width={100}
                        />
                        <div className='order-item-details'>
                            {orderData.item.name}
                            <span>{orderData.item.desc.split('\n')[0]}</span> 
                            <h5 className='mt-5'>₹{orderData.price}</h5>
                        </div>
                        </div>
                    </div>
                    <div className="col-8 d-flex">
                    <Timeline 
                    value={events} 
                    layout='horizontal' 
                    className="custom-timeline"
                    content={(item) => (
                        <span className={`timeline-event ${getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                    )}
                    marker={(item) => (
                        <i className={`custom-marker ${getConnectorClass(item.status)}`} style={{ backgroundColor: item.color }}></i>
                    )}
                    
                    // connector={(item) => (
                    //     <div className={`custom ${getConnectorClass(item.status)}`}></div>
                    // )} 
                    />
                    </div>
                </div>
            </div>
        </div>
       </div>
       <Footer />
    </>
  )
}

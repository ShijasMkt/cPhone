import React from 'react'
import Cookies from "js-cookie";
import "primeflex/primeflex.css";
import "./dashboard.css"
import { useState ,useEffect} from "react";
import swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function DashboardBody() {
	const navigateTo=useNavigate()
    const [overviewData,setOverviewData]=useState({})
	const [formattedPrice,setFormattedPrice]=useState(0)
	
	useEffect(()=>{
		fetchOverview()
	},[])

	useEffect(()=>{
			const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(overviewData.totalRevenue);
			setFormattedPrice(price)
	},[overviewData])

	const fetchOverview=async()=>{
		const res = await fetch("http://127.0.0.1:8000/overview/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!res.ok) {
				swal.fire({
					icon: "error",
					title: "Network Error",
					text: "Please come back again",
				});
			}
			else{
				const data = await res.json();
				setOverviewData(data)
				
				
			}
	}

	const pageNavigation=(page)=>{
		switch (page) {
			case "orders":
				navigateTo('orders')
				break;
			case "users":
				navigateTo('users')
				break;
			case "products":
				navigateTo('products')
				break;
			default:
				break;
		}
	}
  return (
    <div>
      <div className='dashboard-index'>
	  <div className="container">
	  <div className="grid">
			<div className="col-12 md:col-6 lg:col-3 overview-card" onClick={()=>pageNavigation("orders")}>
				<div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Orders</span>
							<div className="text-900 font-medium text-xl">{overviewData.orderCount}</div>
						</div>
						<div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
							<i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 md:col-6 lg:col-3  overview-card" onClick={()=>pageNavigation("orders")}>
				<div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Revenue</span>
							<div className="text-900 font-medium text-xl">{formattedPrice}</div>
						</div>
						<div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
							<i className="pi pi-wallet text-orange-500 text-xl"></i>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 md:col-6 lg:col-3  overview-card" onClick={()=>pageNavigation("users")}>
				<div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Users</span>
							<div className="text-900 font-medium text-xl">{overviewData.userCount}</div>
						</div>
						<div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
							<i className="pi pi-users text-cyan-500 text-xl"></i>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 md:col-6 lg:col-3  overview-card" onClick={()=>pageNavigation("products")}>
				<div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
					<div className="flex justify-content-between mb-3">
						<div>
							<span className="block text-500 font-medium mb-3">Products</span>
							<div className="text-900 font-medium text-xl">{overviewData.productCount}</div>
						</div>
						<div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
							<i className="pi pi-box text-purple-500 text-xl"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	  </div>
	  </div>
    </div>
  )
}

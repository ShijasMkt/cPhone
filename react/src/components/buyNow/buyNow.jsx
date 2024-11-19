import React, { useEffect, useState } from "react";
import "./buyNow.css";
import SecNav from "../secNav/secNav";
import { useLocation,useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import swal from "sweetalert2";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
        
        
        

export default function BuyNow() {
	
	const navigateTo=useNavigate();
	const location = useLocation();
	const { data } = location.state || {};
	const userID = Cookies.get("userID");
	const [addressList, setAddressList] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [isAddressSelected, setAddressSelected] = useState(false);
	const [isItemSelected, setItemSelected] = useState(false);
	const [purchaseInfo, setPurchaseInfo] = useState({
		addressId: "",
		itemId:"",
	});
	const [qty,setQty]=useState(1);
	const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
	const { addressId,itemId } = purchaseInfo;
	const [captchaInput,setCaptchaInput]=useState("");

	function getDate() {
		const today = new Date();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = today.getFullYear();
		const date = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${date}`;
	}
	

	useEffect(() => {

		if(selectedPaymentOption==='cod'){
			loadCaptchaEnginge(6,'white','blue');
		}
		if (data.count) {
			setItemCount(data.count);
		}
		setTotalPrice(data.price*qty + 29);
		const userAddress = async () => {
			const body = JSON.stringify({ userID });
			const res = await fetch("http://127.0.0.1:8000/show_address/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if (!res.ok) {
				swal.fire({
					icon: "error",
					title: "Network Error",
					text: "Please come back again",
				});
			}
			const data = await res.json();
			setAddressList(data);
		};
		userAddress();
	}, [qty,selectedPaymentOption]);

	const deliverySelected = (address) => {
		setPurchaseInfo((prevInfo) => ({
			...prevInfo,
			addressId: address.id,
		}));
		setAddressSelected(true);
	};

	const changeAddress = () => {
		setPurchaseInfo((prevInfo) => ({
			...prevInfo,
			addressId: "",
		}));
		setAddressSelected(false);
	};

	const itemSelected=(item)=>{
		setPurchaseInfo((prevInfo)=>({
			...prevInfo,
			itemId:  data.id
		}))
		setItemSelected(true)
	}

	const itemChanged=()=>{
		setPurchaseInfo((prevInfo)=>({
			...prevInfo,
			itemId:""
		}))
		setItemSelected(false);
	}

  const handlePaymentOption = (option) => {
    if (selectedPaymentOption === option) {
      setSelectedPaymentOption(null);
    } else {
      setSelectedPaymentOption(option);
    }
  };

  const makePayment=()=>{
	switch(selectedPaymentOption){
		case "cod":
			if (validateCaptcha(captchaInput, false)==true) {
				placeOrder();
			}
	 
			else {
				swal.fire({
					icon: "error",
					title: "Wrong Captcha!",
					text: "Please enter the correct Captcha",
				});
			}
			break;
		case "upi":
			break;	
	}
  }

  const placeOrder=async()=>{
	const date=getDate();

	const orderData=new FormData();
	orderData.append("userID",userID);
	orderData.append("itemID",itemId);
	orderData.append("date",date);
	orderData.append("totalPrice",totalPrice);
	orderData.append("qty",qty);
	orderData.append("addressID",addressId);
	orderData.append("paymentMode",selectedPaymentOption);
	orderData.append("paymentID",null);

	const res = await fetch("http://127.0.0.1:8000/place_order/", {
		method: "POST",
		body: orderData,
	});
	if (!res.ok) {
		swal.fire({
			icon: "error",
			title: "Network Error",
			text: "Please come back again",
		});
	}
	else{
		swal.fire({
			icon: "success",
			title: "Order Placed!",
			text: "Your Order Placed Successfully",
		})
		.then(
			navigateTo("/orders")
		)
	}
  }
	return (
		<>
			<SecNav />
			<div className="buyNow-body pt-top">
				<div className="container">
					<div className="row">
						<div className="col-8">
							{!isAddressSelected ? (
								<div className="info-section">
									<div className="info-header">
										<h5 className="mb-0">DELIVERY ADDRESS</h5>
									</div>
									<div className="info-body">
										{addressList.length > 0 ? (
											addressList.map((list) => (
												<div className="address-box" key={list.id}>
													<div className="row">
														<div className="col-9">
															<div className="address-details">
																<span className="card-span">{list.type}</span>
																<span>
																	{list.fname} {list.lname} {list.mobile}
																</span>
																<span>
																	{list.address} - <b>{list.pincode}</b>
																</span>
															</div>
														</div>
														<div className="col-3 card-button">
															<button
																type="button"
																className="btn btn-warning"
																onClick={() => deliverySelected(list)}
															>
																Deliver Here
															</button>
														</div>
													</div>
												</div>
											))
										) : (
											<div className="no-address">
												<p>No Address Found</p>
											</div>
										)}
									</div>
									<div className="p-2">
										<p className="mb-0">
											Add address <a href="/address">here</a>
										</p>
									</div>
								</div>
							) : (
								<div className={"info-selected"}>
									<div className="info-header-selected">
										<div className="d-flex align-items-center">
											<h5 className="mb-0">DELIVERY ADDRESS</h5>
											<span className="material-symbols-outlined check">
												check
											</span>
										</div>

										<div>
											<button
												type="button"
												className="btn btn-outline-primary"
												onClick={changeAddress}
											>
												Change
											</button>
										</div>
									</div>
									<div className="info-body-selected">
										{addressList
											.filter((address) => address.id === addressId)
											.map((selectedAddress) => (
												<div key={selectedAddress.id}>
													<p>
														<b>
															{selectedAddress.fname} {selectedAddress.lname}
														</b>{" "}
														{selectedAddress.address}{" "}
														<b>-{selectedAddress.pincode}</b>
													</p>
												</div>
											))}
									</div>
								</div>
							)}
							{!isItemSelected ? (
								<div className="info-section mt-2">
									<div className="info-header">
										<h5 className="mb-0">ORDER SUMMARY</h5>
									</div>
									<div className="info-body">
										<div className="item-box">
											<div className="row">
												<div className="col-2 d-flex justify-content-center">
												<img
												src={`http://127.0.0.1:8000${data.img}`}
												alt=""
												width={60}
												/>
												</div>
												<div className="col-10">
													<div className="item-info">
													<h5>{data.name}</h5>
													<span className="text-theme-2">{data.desc}</span> 
													<div className="d-flex align-items-center gap-2 mt-2">	
													<h6 className="mb-0">₹{data.price*qty}</h6>
														<div>Qty: <input type="number" value={qty} step={1} onChange={(e)=>setQty(e.target.value)} onKeyDown={(e) => { if (e.key === '.') e.preventDefault(); }} min={1} max={5}/></div>
													</div>
													</div>
												</div>
											</div>
											
										</div>
										<div className="button-box">
											<button className="continue-btn" onClick={()=>itemSelected(data)}>CONTINUE</button>
										</div>
									</div>
								</div>
							) : (
								<div className="info-selected mt-2">
									<div className="info-header-selected">
									<div className="d-flex align-items-center">
											<h5 className="mb-0">ORDER SUMMARY</h5>
											<span className="material-symbols-outlined check">
												check
											</span>
										</div>

										<div>
											<button
												type="button"
												className="btn btn-outline-primary"
												onClick={itemChanged}
											>
												Change
											</button>
										</div>
									</div>
								</div>
							)}
							{isAddressSelected&&isItemSelected&&(
								<div className="info-section mt-2">
								<div className="info-header">
								  <h5 className="mb-0">PAYMENT OPTION</h5>
								</div>
								<div className="info-body">
								  <div className="list-group">
									<button
									  type="button"
									  id="cod"
									  className={`list-group-item list-group-item-action ${selectedPaymentOption === 'cod' ? 'active' : ''}`}
									  onClick={() => handlePaymentOption('cod')}
									>
									  Cash on Delivery
									</button>
									{selectedPaymentOption==='cod'&&(
										<div className="cod-box">
											<div className="row">
											<div className="col-3 d-flex align-items-center justify-content-center"><LoadCanvasTemplate /></div>
											<div className="col-5">
												<input className="form-control" type="text" placeholder="Please Enter the captcha" onChange={(e)=>setCaptchaInput(e.target.value)}/>
											</div>
											<div className="col-4"><button className="buyNow-btn" onClick={makePayment}>Buy Now</button></div>
											</div>
											
											
										</div>
									)}
									<button
									  type="button"
									  id="upi"
									  className={`list-group-item list-group-item-action ${selectedPaymentOption === 'upi' ? 'active' : ''}`}
									  onClick={() => handlePaymentOption('upi')}
									>
									  UPI
									</button>
									{selectedPaymentOption=="upi"&&(
										<div className="upi-box">
											coming soon
										</div>
									)}
									<button
									  type="button"
									  id="card"
									  className="list-group-item list-group-item-action disabled"
									  onClick={() => handlePaymentOption('card')}
									>
									  Card
									</button>
									<button
									  type="button"
									  id="emi"
									  className="list-group-item list-group-item-action disabled"
									  onClick={() => handlePaymentOption('emi')}
									>
									  EMI
									</button>
								  </div>
								</div>
							  </div>
							)}
						</div>
						<div className="col-4">
							<div className="summary-section">
								<div className="summary-header">
									<h5 className="mb-0">PRICE DETAILS</h5>
								</div>
								<hr />
								<div className="summary-body">
									<div className="summary-item">
										<span>
											Price({qty} {qty > 1 ? <>items</> : <>item</>}
											)
										</span>
										<span>₹{data.price*qty}</span>
									</div>
									<div className="summary-item">
										<span>Delivery Charges</span>
										<span>
											{" "}
											<div>
												<strike>₹70</strike>
												<span className="text-success"> FREE</span>
											</div>
										</span>
									</div>
									<div className="summary-item">
										<span>Packaging Charge</span>
										<span>₹29</span>
									</div>

									<hr className="mt-2" />
									<b>
										<div className="summary-item">
											<span>Total Payable</span>
											<span>₹{totalPrice}</span>
										</div>
									</b>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

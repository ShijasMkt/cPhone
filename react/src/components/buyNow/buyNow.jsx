import React, { useEffect, useState } from "react";
import "./buyNow.css";
import SecNav from "../secNav/secNav";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import swal from "sweetalert2";

export default function BuyNow() {
	const location = useLocation();
	const { data } = location.state || {};
	const userID = Cookies.get("userID");
	const [addressList, setAddressList] = useState([]);
	const [itemCount, setItemCount] = useState(1);
	const [totalPrice, setTotalPrice] = useState(0);
	const [isAddressSelected, setAddressSelected] = useState(false);
	const [isTransitionActive, setTransitionActive] = useState(false);
	const [purchaseInfo, setPurchaseInfo] = useState({
		addressId: "",
	});

	const { addressId } = purchaseInfo;

	useEffect(() => {
		if(data.count){
			setItemCount(data.count)
		}
		setTotalPrice(data.price + 29);
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
		
	}, []);

	const deliverySelected = (address) => {
		setPurchaseInfo((prevInfo) => ({
      ...prevInfo,
      addressId: address.id,
    }));
		setAddressSelected(true);
		

	};

	const changeAddress=()=>{
		setPurchaseInfo((prevInfo) => ({
			...prevInfo,
			addressId: "",
		  }));
		  setAddressSelected(false);
		  
	}
	return (
		<>
			<SecNav />
			<div className="buyNow-body">
			<div className="container mt-3">
				<div className="row">
					<div className="col-8">
						{!isAddressSelected?(
							<div className='address-section'>
								<div className="info-header">
									<h3>DELIVERY ADDRESS</h3>
								</div>
								<div className="info-body ">
									{addressList.length > 0 ? (
										addressList.map((list) => (
											<div className="row" key={list.id}>
												<div className="display-address-box">
													<div className="card address-card">
														<div className="card-body d-flex">
															<div className="col-10">
																<span className="card-span">{list.type}</span>
																<div className="card-title">
																	{list.fname} {list.lname} {list.mobile}
																</div>
																<div className="card-text">
																	{list.address} - <b>{list.pincode}</b>
																</div>
															</div>
															<div className="col-2 card-button">
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
							</div>):(
							<div className={'address-selected'}>
							<div className="info-header-selected">
									<div className="d-flex align-items-center">
									<h3>DELIVERY ADDRESS</h3>
									<span className="material-symbols-outlined check" >
                    				check
								    </span>
									</div>
									
									<div><button type="button" className="btn btn-outline-primary" onClick={changeAddress}>Change</button></div>
								</div>
								<div className="info-body-selected">
									{
										addressList.filter((address)=>address.id===addressId)
										.map((selectedAddress)=>(
											<div key={selectedAddress.id}>
												<p><b>{selectedAddress.fname} {selectedAddress.lname}</b> {selectedAddress.address} <b>-{selectedAddress.pincode}</b></p>
												
											</div>
										))
									}
								</div>
								
							</div>
							)}
						
					</div>
					<div className="col-4">
						<div className="summary-section">
							<div className="summary-header">
								<h3>PRICE DETAILS</h3>
							</div>
							<hr />
							<div className="summary-body">
								<div className="summary-item">
									<span>Price({itemCount} {itemCount>1?<>items</>:<>item</>})</span>
									<span>₹{data.price}</span>
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

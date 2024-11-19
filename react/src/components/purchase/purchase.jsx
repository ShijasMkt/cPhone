import React from "react";
import "./purchase.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import SecNav from "../secNav/secNav";
import { useNavigate } from "react-router-dom";

export default function Purchase() {
	const location = useLocation();
	const { data } = location.state || {};
	const [deliveryDate, setDeliveryDate] = useState();
	const [visibleMenu, setVisibleMenu] = useState(false);
	const navigateTo = useNavigate();
	const uName = Cookies.get("userName");
	const userID = Cookies.get("userID");
	useEffect(() => {
		const createDeliveryDate = () => {
			const today = new Date();
			var monthNum = today.getMonth();
			const year = today.getFullYear();
			var date = today.getDate();
			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			if (date < 27) {
				return `${date + 3} -${date + 5} ${monthNames[monthNum]}`;
			} else {
				date = 1;
				monthNum = monthNum + 1;
				return `${date} -${date + 3} ${monthNames[monthNum]}`;
			}
		};
		const new_date = createDeliveryDate();
		setDeliveryDate(new_date);
	}, []);

	const lastBuyPage = (phone) => {
		navigateTo("/buyNow", { state: { data: phone } });
	};

	return (
		<>
			<SecNav />

			<div className="purchase-body pt-top">
				<div className="container">
					<div className="row">
						<div className="col-5">
							<div className="d-block">
								<a
									href={`http://127.0.0.1:8000${data.img}`}
									className="img-box"
								>
									<img
										src={`http://127.0.0.1:8000${data.img}`}
										alt="phone"
										className="phone-img"
									/>
								</a>
							</div>
						</div>
						<div className="col-4 d-block ">
							<div className="name-box">
								<h1>{data.name}</h1>
								<hr />
								<div>
									{data.desc.split("\n").map((line, index) => (
										<span key={index}>
											{line}
											<br />
										</span>
									))}
								</div>
								<hr />
								<div className="price-box">
									<h4>
										₹ <b>{data.price}</b>
									</h4>
								</div>
								<p>Inclusive of all taxes</p>
								<hr />
								<div className="row policy-box">
									<div className="col-4">
										<span className="material-symbols-outlined">
											local_shipping
										</span>
										<p>Free Delivery</p>
									</div>
									<div className="col-4">
										<span className="material-symbols-outlined">
											inventory_2
										</span>
										<p>7 Days Replacement</p>
									</div>
									<div className="col-4">
										<span className="material-symbols-outlined">
											local_police
										</span>
										<p>1 Year Warranty</p>
									</div>
								</div>
							</div>
						</div>
						<div className=" col-12 col-md-3">
							<div className="purchase-view">
								<h5>
									{" "}
									Free Delivery :{" "}
									<span>
										<b>{deliveryDate}</b>
									</span>
								</h5>
								<div className="bank-offers">
									<ul>
										<li>
											Bank OfferExtra ₹250 off on HDFC Bank Pixel Credit Card
											Transactions. Min Txn Value: ₹5,000
										</li>
										<li>
											Bank OfferExtra ₹500 off on HDFC Bank Pixel Credit Card
											EMI Transactions. Min Txn Value: ₹5,000
										</li>
										<li>
											Bank Offer5% Unlimited Cashback on Flipkart Axis Bank
											Credit Card
										</li>
										<li>
											Special PriceGet extra ₹5901 off (price inclusive of
											cashback/coupon)
										</li>
									</ul>
								</div>
								<div className="button-section">
									<button
										type="button"
										className="btn btn-warning buyNow-button"
										onClick={() => lastBuyPage(data)}
									>
										Buy Now
									</button>
									<div className="gift-check">
										<input type="checkbox" id="gift-check" />
										<label htmlFor="gift-check">Make it a gift</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

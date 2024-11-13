import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./inside.css";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SecNav from "../secNav/secNav";
import { useUser } from "../authentication/userContext";
import { useWishlist } from "../wishlist/wishlistContext";

export default function Inside() {
	const { isUser } = useUser();
	const [phones, setPhones] = useState([]);
	const navigateTo = useNavigate();
	const uName = Cookies.get("userName");
	const { wishlistItems, addToWishlist, deleteWishlistItem } = useWishlist();

	useEffect(() => {
		const fetchPhones = async () => {
			const res = await fetch("http://127.0.0.1:8000/phones/", {
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
			const data = await res.json();
			setPhones(data);
		};

		fetchPhones();
	}, []);

	function getDate() {
		const today = new Date();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = today.getFullYear();
		const date = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${date}`;
	}

	const addItemToCart = async (e) => {
		var userID = Cookies.get("userID");
		if (!userID) {
			userID = 69;
		}
		var itemID = e.target.id;
		const date = getDate();
		const body = JSON.stringify({ userID, itemID, date });
		const res = await fetch("http://127.0.0.1:8000/add_cart/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) {
			window.dispatchEvent(new Event("openCartSidebar"));
		}
	};

	const toBuyNowPage = (phone) => {
		navigateTo("/buyNow", { state: { data: phone } });
	};

	const toViewPage = (phone) => {
		navigateTo("/purchase", { state: { data: phone } });
	};

	const toggleWishlist = (phoneID) => {
		const isInWishlist = wishlistItems.some(item => item.id === phoneID);  // Check if the item is in the wishlist
		if (isInWishlist) {
		  deleteWishlistItem(phoneID);
		} else {
		  addToWishlist(phoneID);
		}
	  };
	  

	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	return (
		<>
			<div className="inside-body">
				<SecNav />
				<div>
					<div className="home-banner">
						<video src="src\assets\video.mp4" autoPlay loop></video>
					</div>
				</div>
				<div className={"main-body"}>
					<div className="container">
						<div className="d-padding">
							<div className="row justify-content-center">
								<>
									<div className="col-12 text-center">
										<h2 className="mb-0 fw-bold text-black">New Arrivals</h2>
										<p className="text-black">Discover the Latest Additions!</p>
									</div>

									{phones.map((phone) => (
										<div
											key={phone.id}
											className="col-12 col-md-3 product-card"
										>
											<div className="card p-2">
												{isUser ? (
													<span
														item-data={phone.id}
														className="material-symbols-outlined"
														onClick={() => toggleWishlist(phone.id)}
														style={{
															color:wishlistItems.some(item => item.id === phone.id) ? "red" : "black",
														}}
													>
														favorite
													</span>
												) : (
													<></>
												)}

												<div
													className="card-img-box"
													onClick={() => toViewPage(phone)}
												>
													<img
														className="card-img"
														src={`http://127.0.0.1:8000${phone.img}`}
														alt=""
													/>
												</div>

												<div className="card-body">
													<h6 className="card-title fw-bold">{phone.name}</h6>
													<p className="card-text mb-1">₹ {phone.price}</p>
													<div className="card-btn">
														<button
															onClick={() => toBuyNowPage(phone)}
															className="btn text-danger"
														>
															Buy Now
														</button>
														<button
															id={phone.id}
															onClick={addItemToCart}
															className="btn"
														>
															Add to cart
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

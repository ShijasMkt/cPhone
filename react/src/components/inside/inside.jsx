import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./inside.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { json, Navigate } from "react-router-dom";
import swal from "sweetalert2";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from 'react-router-dom';
import Logout from "../logout/logout";

export default function Inside() {
	const [phones, setPhones] = useState([]);
	const [isFocused, setIsFocused] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [isResult, setResult] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [visibleCart, setVisibleCart] = useState(false);
	const [visibleMenu, setVisibleMenu] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const navigateTo=useNavigate();
	const uName =Cookies.get("userName")


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
	
	

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
		setResult(false);
	};
	
	const searchResult = () => {
		const results = phones.filter((phone) =>
			phone.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		if (results) {
			setResult(true);
		}
		setSearchList(results);
	};

	

	function getDate() {
		const today = new Date();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = today.getFullYear();
		const date = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${date}`;
	}

	const addItemToCart = async (e) => {
		const userID = Cookies.get("userID");
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
			showCart();
		}
	};

	const showCart = async () => {
		const userID = Cookies.get("userID");
		const body = JSON.stringify({ userID });
		const res = await fetch("http://127.0.0.1:8000/show_cart/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) {
			const data = await res.json();
			const productsWithQty = data["products"].map((product, index) => ({
				...product,  // Spread the product data
				qty: data["quantities"][index]  // Add the corresponding quantity
			}));
			setCartItems(productsWithQty);
			setTotalPrice(data["total_price"]);
			setVisibleCart(true);
		} else {
			swal.fire({
				icon: "error",
				title: "Network Error",
				text: "Can't show cart right now",
			});
		}
	};
	const handleKeyPress = (event) => {
		
		if (event.key === "Enter") {
			document.getElementById('searchBox').blur();
			document.getElementById('searchIcon').click();
		}
	};

	const deleteCartItem=async(item,qty,option)=>{
		if (option==1){
			const userID = Cookies.get("userID");
		var itemID=item;
		

		const body = JSON.stringify({ userID, itemID, option});
		const res = await fetch("http://127.0.0.1:8000/delete_cart_item/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if(res.status==200){
			showCart();
		}
		}
		else{
			const userID = Cookies.get("userID");
			const body=JSON.stringify({userID,option})
			const res = await fetch("http://127.0.0.1:8000/delete_cart_item/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if(res.status==200){
				showCart();
			}
		}
	}
	const showMenu=()=>{
		setVisibleMenu(true)
		
	}

	const toBuyNowPage=(phone)=>{
		navigateTo('/purchase',{state:{data:phone}})
	}

	const menuPageChange=(option)=>{
		if(option==1){
			navigateTo('/address')
		}
		else{
			navigateTo('/orders')
		}
	}

	const toLastBuyPage=()=>{
		const cartCount=cartItems.length
		var itemQty=0
		cartItems.forEach(element => {
			itemQty=itemQty+element.qty
		});
		const cartData={
			count: itemQty,
			price: totalPrice,
		}
		
		if(cartCount>0){
			navigateTo('/buyNow',{state:{data:cartData}})
		}
		
		else
		{
			swal.fire({
				icon: "error",
				title: "Cart Empty!",
				text: "Please add some item to cart",
			}).then(
				navigateTo('/inside')
			)
			;
		}

		
	}
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
	return (
		<>
			<div className="inside-body">
				<nav>
					<div className="nav-container">
						<div className="d-flex">
							<div className="col-2 d-flex ">
								<span
									onClick={showMenu}
									className="material-symbols-outlined menu-icon"
								>
									menu
								</span>
								<Sidebar
									visible={visibleMenu}
									position="left"
									onHide={() => setVisibleMenu(false)}
									className="sidebar-left"
								>
									<div className="menu-box">
										<div className="menu-header">
											<h2>Hi, {uName}</h2>
											
										</div>
										<hr />
										<div className="menu-body">
											<div className="option-box" onClick={()=>menuPageChange(1)} >
												
												<span className="material-symbols-outlined">
												explore 
												</span>
												<span className="ms-1">Your Address</span>
												
											</div>
											<div className="option-box" onClick={()=>menuPageChange(2)}>
												
												<span className="material-symbols-outlined">
												orders 
												</span>
												<span className="ms-1">Your Orders</span>
												
											</div>
										</div>
										
										<div className="menu-footer">
											<Logout/>
										</div>
									</div>	
								</Sidebar>
								<div className="nav-logo">
								<a href="/">
									<img
										src="src\assets\icon-white.png"
										width="30"
										height="30"
										className="d-inline-block align-top nav-img"
										alt="React Bootstrap logo"
									/>
								</a>
								<a href='/' className="nav-span">cPhone</a>
								</div>
							</div>
							<div className="col-8 d-flex justify-content-center">
								<div
								id="search-box"
								className={` d-flex ${
									isFocused ? "search-bar-box-focus" : "search-bar-box"
								}`}
								onFocus={handleFocus}
								onBlur={handleBlur}
								>	
								<input
									id="searchBox"
									value={searchValue}
									className="search-bar"
									type="search"
									placeholder="Search any product..."
									onChange={(e) => setSearchValue(e.target.value)}
									onFocus={() => setIsSearch(true)}
									onBlur={() => setIsSearch(false)}
									onKeyDown={handleKeyPress}
								/>
								<span
									id='searchIcon'
									onClick={searchResult}
									className="material-symbols-outlined search-bar-icon"
								>
									search
								</span>
								</div>
							</div>
							<div className="col-2 d-flex justify-content-end">
								<div className="d-flex">
								<span
									onClick={showCart}
									className="material-symbols-outlined cart-icon"
								>
									shopping_cart
								</span>

								<Sidebar
									visible={visibleCart}
									position="right"
									onHide={() => setVisibleCart(false)}
									className="sidebar-right"
								>
									<div className="cart-box">
										<div className="cart-header">
											<h2>Cart</h2>
											<h5>
												Total Price:{" "}
												<span className="text-danger">{totalPrice}</span>{" "}
											</h5>
										</div>
										<hr />
										<div className="cart-items">
											{cartItems.length > 0 ? (
												<>
													{cartItems.map((list) => (
														<div className="cart-item-box " key={list.id}>
															<div className="row align-items-center">
																<div className="col-3">
																	<img src={`http://127.0.0.1:8000${list.img}`} alt="" width={60} />
																</div>
																<div className="col-6">
																	<div className="d-block">
																		<h6>
																			<b>{list.name}</b>
																		</h6>
																		<h6>
																			Price :<b>{list.price}</b>{" "}
																		</h6>
																		<h6>Qty :<b>{list.qty}</b></h6>
																	</div>
																</div>
																<div  className="col-3" >
																	<button  type="button" className="btn btn-danger" onClick={() => deleteCartItem(list.id, list.qty,1)}>
																		<span className="material-symbols-outlined" >
																		delete
																		</span>
																	</button>
																</div>
															</div>
														</div>
													))}
												</>
											) : (
												<></>
											)}
										</div>
										<div className="cart-buttons">
											<button type="button" className="btn btn-success" onClick={toLastBuyPage}>
												Check Out
											</button>
											<button type="button" className="btn btn-danger" onClick={()=>deleteCartItem(0,0,2)}>
												Clear Cart
											</button>
										</div>
									</div>
								</Sidebar>
								</div>
							</div>
						</div>
					</div>
				</nav>
				<div className={`${isSearch ? "body-blur" : "main-body"} ${isResult ? "result-body" : "main-body"}`}>
					<div className="container">
						<div className="row">
							{isResult ? (
								searchList.length > 0 ? (
									<>
										{searchList.map((list) => (
											<div
												key={list.id}
												className="col-sm d-flex justify-content-center"
											>
												<div className="card">
													<div className="card-img-box">
														<img
															className="card-img"
															src={`http://127.0.0.1:8000${list.img}`}
															alt="" 
														/>
													</div>
													
													<div className="card-body">
														<h5 className="card-title">{list.name}</h5>
														<p className="card-text">INR {list.price}</p>
														<div className="d-flex justify-content-between">
															<button onClick={()=>toBuyNowPage(list)} className="btn btn-primary">
																Buy Now
															</button>
															<button
																id={list.id}
																onClick={addItemToCart}
																className="btn btn-primary"
															>
																Add to cart
															</button>
														</div>
														
													</div>
												</div>
											</div>
										))}
									</>
								) : (
									<>
										<div className="vh-100 d-flex justify-content-center">
											<h1>No result found</h1>
										</div>
									</>
								)
							) : (
								<>
									{phones.map((phone) => (
										<div
											key={phone.id}
											className="col-sm d-flex justify-content-center"
										>
											<div className="card">
												<div className="card-img-box">
												<img
													className="card-img"
													src={`http://127.0.0.1:8000${phone.img}`}
													alt=""
												/>
												</div>
												
												<div className="card-body">
													<h5 className="card-title">{phone.name}</h5>
													<p className="card-text">INR {phone.price}</p>
													<div className="d-flex justify-content-between">
														<button onClick={()=>toBuyNowPage(phone)} className="btn btn-primary">
															Buy Now
														</button>
														<button
															id={phone.id}
															onClick={addItemToCart}
															className="btn btn-primary"
														>
															Add to cart
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

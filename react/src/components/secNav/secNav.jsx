import React, { useContext, useEffect, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import Logout from "../logout/logout";
import "./secNav.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Home from "../home/home";
import { useUser } from "../authentication/userContext";
import swal from "sweetalert2";
import Cart from "../cart/cart";
import { useWishlist } from "../wishlist/wishlistContext";
import Wishlist from "../wishlist/wishlist";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
        
        

export default function SecNav() {
	const [visibleMenu, setVisibleMenu] = useState(false);
	const [visibleCart, setVisibleCart] = useState(false);
	const [showHomePopup, setShowHomePopup] = useState(false);
	const uName = Cookies.get("userName");
	const navigateTo = useNavigate();
	const { isUser } = useUser();
	const {displayName}=useUser();
    const [items, setItems] = useState([]);
	const op = useRef(null);
	const { wishlistItems, addToWishlist, deleteWishlistItem } = useWishlist();
	const [userDetails,setUserDetails]=useState({});
	useEffect(()=>{
		fetchUserDetails();
		fetchPhones();
	},[])

	useEffect(()=>{
		if(isUser){
			fetchUserDetails();
		}
	},[isUser])

	useEffect(() => {
		
		const handleOpenCartSidebar = () => {
			setVisibleCart(true);
		};

		window.addEventListener("openCartSidebar", handleOpenCartSidebar);

		return () => {
			window.removeEventListener("openCartSidebar", handleOpenCartSidebar);
		};
	}, [wishlistItems]);

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
				setItems(data);
			};
	const [searchValue, setSearchValue] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [isResult, setResult] = useState(false);
			const handleKeyPress = (event) => {
				if (event.key === "Enter") {
					document.getElementById("searchBox").blur();
					document.getElementById("searchIcon").click();
				}
			};
			const searchResult = () => {
				const results = items.filter((item) =>
					item.name.toLowerCase().includes(searchValue.toLowerCase())
				);
				if (results) {
					setResult(true);
				}
				setSearchList(results);
				navigateTo("/result", { state: { data: results ,search:searchValue} });
			};

	const fetchUserDetails = async () => {
		const userID = Cookies.get('userID');
		const body = JSON.stringify({ userID });
		if(userID){
			try {
				const res = await fetch("http://127.0.0.1:8000/user_details/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body,
				});
	
				const data = await res.json();
				if (data.userData) {
					setUserDetails(data.userData);
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
			}
		}

		
	}

	const handleLoginClick = () => {
		setShowHomePopup(true);
	};

	const closeHomePopup = () => {
		setShowHomePopup(false);
	};
	const showMenu = () => {
		setVisibleMenu(true);
	};

	const menuPageChange = (option) => {
		switch (option) {
			case 1:
				navigateTo("/address");
				break;
			case 2:
				navigateTo("/orders");
				break;
			case 3:
				navigateTo("/profile");
				break;
			default:
				break;
		}
	};

	return (
		<>
			<div className="navbar-top fixed-top">
				<nav className="navbar navbar-expand-xl">
					<div className="container">
						<div>
							<Link className="nav-logo" to="/">
								<h2 className="mb-0">cPhone</h2>
							</Link>
						</div>
						

						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>

						<div
							className="collapse navbar-collapse"
							id="navbarNav"
							style={{ flexGrow: "0.5", justifyContent: "end" }}
						>
							<ul className="navbar-nav gap-3 align-items-center">
								<li className="nav-item">
								<div
									id="search-box"
									className={"d-flex search-bar-box"}
								>
									<input
										id="searchBox"
										value={searchValue}
										className="search-bar"
										type="search"
										placeholder="Search our products..."
										onChange={(e) => setSearchValue(e.target.value)}
										onKeyDown={handleKeyPress}
									/>
									<span
										id="searchIcon"
										onClick={searchResult}
										className="material-symbols-outlined search-bar-icon"
									>
										search
									</span>
								</div>
								</li>
								<div className="profile-area">
									{isUser ? (
										<>
											<li className="nav-item" onClick={showMenu}>
												<div className="d-flex">
													<span className="material-symbols-outlined">
														account_circle
													</span>
													<h5>{userDetails.name}</h5>
												</div>
											</li>
										</>
									) : (
										<>
											<li className="nav-item">
												<Link to={"#"} onClick={handleLoginClick}>
													Login/Register
												</Link>
											</li>
											
										</>
									)}
								</div>
								{isUser && <Wishlist />}

								<li className="nav-item">
									<span
										onClick={() => setVisibleCart(true)}
										className="material-symbols-outlined "
									>
										shopping_cart
									</span>

									<Sidebar
										visible={visibleCart}
										position="right"
										onHide={() => setVisibleCart(false)}
										className="sidebar-right"
									>
										<Cart />
									</Sidebar>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
			{showHomePopup && (
				<div className="popup-overlay">
					<div className="popup-content">
						<div className="popup-button">
							<button className="close-button" onClick={closeHomePopup}>
								X
							</button>
						</div>
						<Home />
					</div>
				</div>
			)}
			<Sidebar
				visible={visibleMenu}
				position="left"
				onHide={() => setVisibleMenu(false)}
				className="sidebar-left"
			>
				<div className="menu-box">
					<div className="menu-header">
						<h2 className="mb-0">Hello, {userDetails.name}</h2>
						<div>{userDetails.user_img && (<img
							src={`http://127.0.0.1:8000${userDetails.user_img}`}
							alt=""
							className="userImg"
						/>)}
						</div>
						
					</div>
					<hr />
					<div className="menu-body">
						<div className="option-box" onClick={() => menuPageChange(3)}>
							<span className="material-symbols-outlined">person</span>
							<span className="ms-1">My Profile</span>
						</div>
						<div className="option-box" onClick={() => menuPageChange(1)}>
							<span className="material-symbols-outlined">explore</span>
							<span className="ms-1">My Address</span>
						</div>
						<div className="option-box" onClick={() => menuPageChange(2)}>
							<span className="material-symbols-outlined">orders</span>
							<span className="ms-1">My Orders</span>
						</div>
					</div>

					<div className="menu-footer">
						<Logout />
					</div>
				</div>
			</Sidebar>
		</>
	);
}

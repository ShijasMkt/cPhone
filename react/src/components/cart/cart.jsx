import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";


export const showCart = async (setCartItems,setTotalPrice) => {
    var userID = Cookies.get("userID");
    if(!userID){
        userID=69;
    }
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
            ...product, // Spread the product data
            qty: data["quantities"][index], // Add the corresponding quantity
        }));
        setCartItems(productsWithQty);
        setTotalPrice(data["total_price"]);
    } else {
        swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Can't show cart right now",
        });
    }
};

export default function Cart() {
    const navigateTo=useNavigate();
	const [totalPrice, setTotalPrice] = useState(0);
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		showCart(setCartItems,setTotalPrice);
	}, []);

    

	const deleteCartItem = async (item, qty, option) => {
		if (option == 1) {
			var userID = Cookies.get("userID");
            if(!userID){
                userID=69;
            }
			var itemID = item;

			const body = JSON.stringify({ userID, itemID, option });
			const res = await fetch("http://127.0.0.1:8000/delete_cart_item/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if (res.status == 200) {
				showCart(setCartItems,setTotalPrice);
			}
		} else {
			var userID = Cookies.get("userID");
            if(!userID){
                userID=69;
            }
			const body = JSON.stringify({ userID, option });
			const res = await fetch("http://127.0.0.1:8000/delete_cart_item/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if (res.status == 200) {
				showCart(setCartItems,setTotalPrice);
			}
		}
	};

	const toLastBuyPage = () => {
		const cartCount = cartItems.length;
		var itemQty = 0;
		cartItems.forEach((element) => {
			itemQty = itemQty + element.qty;
		});
		const cartData = {
			count: itemQty,
			price: totalPrice,
		};

		if (cartCount > 0) {
			navigateTo('/buyNow', { state: { data: cartData } });
		} 
        else {
			swal
				.fire({
					icon: "error",
					title: "Cart Empty!",
					text: "Please add some item to cart",
				})
				.then(() => navigateTo("/inside"));
		}
	};
	return (
		<div>
			<div className="cart-box">
				<div className="cart-header">
					<h2>Cart</h2>
					<h5>
						Total Price: <span className="text-danger">{totalPrice}</span>{" "}
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
											<img
												src={`http://127.0.0.1:8000${list.img}`}
												alt=""
												width={60}
											/>
										</div>
										<div className="col-6">
											<div className="d-block">
												<h6>
													<b>{list.name}</b>
												</h6>
												<h6>
													Price :<b>{list.price}</b>{" "}
												</h6>
												<h6>
													Qty :<b>{list.qty}</b>
												</h6>
											</div>
										</div>
										<div className="col-3">
											<button
												type="button"
												className="btn btn-danger"
												onClick={() => deleteCartItem(list.id, list.qty, 1)}
											>
												<span className="material-symbols-outlined">
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
					<button
						type="button"
						className="btn btn-success"
						onClick={toLastBuyPage}
					>
						Check Out
					</button>
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => deleteCartItem(0, 0, 2)}
					>
						Clear Cart
					</button>
				</div>
			</div>
		</div>
	);
}

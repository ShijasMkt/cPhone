
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import swal from "sweetalert2";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = async () => {
    const userID = Cookies.get("userID");
    const body = JSON.stringify({ userID });
    const res = await fetch("http://127.0.0.1:8000/show_wishlist/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      setWishlistItems(data.products); // Store as an array
    } else {
      swal.fire({ icon: "error", title: "Network Error", text: "Please come back again" });
    }
  };

  const addToWishlist = async (itemID) => {
    const userID = Cookies.get("userID");
    const body = JSON.stringify({ userID, itemID });
    const res = await fetch("http://127.0.0.1:8000/add_wishlist/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.status === 200) {
      fetchWishlist(); // Re-fetch wishlist after adding
      window.dispatchEvent(new Event("openWishlistPopup"));
    } else {
      swal.fire({ icon: "error", title: "Error", text: "Item already in Wishlist" });
    }
  };

  const deleteWishlistItem = async (itemID) => {
    const userID = Cookies.get("userID");
    const body = JSON.stringify({ userID, itemID });
    const res = await fetch("http://127.0.0.1:8000/delete_wishlist_item/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.status === 200) {
      setWishlistItems((prev) => prev.filter(item => item.id !== itemID));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, deleteWishlistItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

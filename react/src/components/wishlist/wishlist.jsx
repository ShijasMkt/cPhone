import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { useWishlist } from "../wishlist/wishlistContext";
import "./wishlist.css"; 

export default function Wishlist() {
    const op = useRef(null);
    const { wishlistItems, deleteWishlistItem } = useWishlist();

    const showWishlist = (e) => {
        op.current.toggle(e);
    };

    const handleDelete = (id) => {
        deleteWishlistItem(id);
    };

    return (
        <div>
            <div className="wishlist-out" onClick={(e) => showWishlist(e)}>
                <span className="material-symbols-outlined">favorite</span>
                <h6 className="wish-num">{wishlistItems.length}</h6>
            </div>

            <OverlayPanel ref={op} dismissable className="wishlist-panel">
                <div className="wishlist-items">
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                            <div className="wishlist-box" key={item.id}>
                                <div className="wish-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex gap-2 align-items-center">
                                            <img
                                                src={`http://127.0.0.1:8000${item.img}`}
                                                alt=""
                                                width={30}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                        <span
                                            onClick={() => handleDelete(item.id)}
                                            className="material-symbols-outlined remove-icon"
                                        >
                                            remove
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <span>No items found!!</span>
                    )}
                </div>
            </OverlayPanel>
        </div>
    );
}

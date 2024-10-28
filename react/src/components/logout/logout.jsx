import React from 'react'
import "./logout.css";
import Cookies from 'js-cookie';

export default function Logout() {
    const logoutFunc = () => {
		if (Cookies.get("userKey")) {
			Cookies.remove("userKey");
            Cookies.remove('userID');
            Cookies.remove('userName');
			window.location = "/";
		}
	};
  return (
    <div>
        <button className="logout-button" onClick={logoutFunc}>
            Logout
        </button>
    </div>
  )
}







import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import "./adminAuth.css"


export default function AdminAuth() {
    
	const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
		username: "",
		password: "",
	});
    const { username, password } = loginFormData;
	const handleChange = (e) => {
		const { id, value } = e.target;
		setLoginFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

    const checkLogin = (e) => {
        e.preventDefault();
		if (username == "admin") {
			if (password == "admin") {
				Cookies.set("adminLogged", true, {
					expires: 1,
					sameSite: "None",
					secure: true,
				});
				Swal.fire({
					icon: "success",
					title: "Welcome",
					text: "you've successfully logged in",
				}).then(() => {
					window.location="/admin"
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Incorrect Password",
					text: "Please enter a correct password!!",
				});
			}
		} else {
			Swal.fire({
				icon: "error",
				title: "User not Found",
				text: "Please enter a correct username!!",
			});
		}
	};
  return (
    <div className='adminAuth-body'>
        <div className="admin-login">
            <div className="admin-form">
                <h3>cPhone Admin</h3>
                <br />
                <form >
                <input type="text" placeholder="username" id='username' onChange={handleChange}/>
                <input type="password" placeholder="password" id='password' onChange={handleChange}/>
                <button onClick={checkLogin}>login</button>
                
                </form>
            </div>
        </div>
    </div>
  )
}

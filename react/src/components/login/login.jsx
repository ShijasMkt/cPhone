import React from "react";
import { useState, useEffect } from "react";
import "/src/assets/css/main.css";
import swal from "sweetalert2";
import Cookies from "js-cookie";
import { useUser } from "../authentication/userContext";
import { useNavigate } from "react-router-dom";

export default function Login({ changePage }) {
	const navigateTo = useNavigate();
	const { setIsUser } = useUser();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const [icon, setIcon] = useState("visibility");
	const [type, setType] = useState("password");

	const changeIcon = (event) => {
		const currentIcon = icon;
		if (type == "password") {
			setType("text");
		} else {
			setType("password");
		}
		if (currentIcon == "visibility") {
			setIcon("visibility_off");
		} else {
			setIcon("visibility");
		}
	};

	const checkLogin = async () => {
		const body = JSON.stringify({ email, password });
		const res = await fetch("http://127.0.0.1:8000/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		const text = await res.text();

		// Attempt to parse JSON if the response text is not empty
		const data = text ? JSON.parse(text) : {};

		if (res.status == 200) {
			let userKey = data.user_key;
			let userID = data.user_id;
			let userName = data.user_name;

			Cookies.set("userKey", userKey, {
				expires: 1,
				sameSite: "None",
				secure: true,
			});
			Cookies.set("userID", userID, {
				expires: 1,
				sameSite: "None",
				secure: true,
			});
			Cookies.set("userName", userName, {
				expires: 1,
				sameSite: "None",
				secure: true,
			});
			setIsUser(true);
			swal
				.fire({
					icon: "success",
					title: "Welcome",
					text: "you've successfully logged in",
				})
				.then((res) => {
					window.location="/";
				});
		} else if (res.status == 401) {
			swal.fire({
				icon: "error",
				title: "Opps...",
				text: "User not found",
				footer: '<a href="/forgot">Forgot password?</a>',
			});
		} else if (res.status == 400) {
			swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Incorrect password.",
			});
		} else {
			swal.fire({
				icon: "error",
				title: "Oops...",
				text: "An unexpected error occurred. Please try again later.",
			});
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			checkLogin();
		}
	};
	return (
		<>
			<form>
				<div className="welcome-part">
					<p>Welcome Back!</p>
					<h2>Login to your account</h2>
				</div>
				<div className="input-part">
					<label>Email:</label>
					<div className="field-box">
						<span className="material-symbols-outlined field-icon">mail</span>
						<input
							className="field-input"
							value={email}
							type="email"
							id="email"
							placeholder="Your Email"
							onChange={handleChange}
							onKeyDown={handleKeyPress}
						/>
					</div>
					<label>Password:</label>
					<div className="field-box">
						<span className="material-symbols-outlined key field-icon">
							key
						</span>
						<input
							className="field-input"
							value={password}
							type={type}
							id="password"
							placeholder="Your Password"
							onChange={handleChange}
							onKeyDown={handleKeyPress}
						/>
						<span
							className="material-symbols-outlined eye"
							onClick={() => changeIcon()}
						>
							{icon}
						</span>
					</div>
				</div>
				<div className="d-flex justify-content-between mt-3">
					<div className="check">
						<input type="checkbox" className="me-2" />
						<label>Remember Me</label>
					</div>
					<div className="link">
						Don't have an account?{" "}
						<span data-value="SignUp" className="fw-bold" onClick={changePage}>
							Sign up
						</span>
						
					</div>
				</div>
				<button className="login-button" type="button" onClick={checkLogin}>
					Log in
				</button>
			</form>
      <a href="/forgot" className="forget">
							Forgot Password?
						</a>
		</>
	);
}

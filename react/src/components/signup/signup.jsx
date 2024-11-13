import React from "react";
import "/src/assets/css/main.css";
import { useState, useEffect } from "react";
import swal from "sweetalert2";
import { isValidEmail, getLastInvalidText } from 'email-validator-dns-provider-rules';
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";

export default function SignUp({ changePage }) {
	const navigateTo=useNavigate();
	const [icon, setIcon] = useState("visibility");
	const [type, setType] = useState("password");
	const [isStrong, setStrong] = useState(false);
	const [validEmail,setValidEmail]=useState(false);
	const [password, setPassword] = useState("");
	const [uName,setName]=useState("");
	const [email,setEmail]=useState("");
	const [inputFocused, setInputFocused] = useState(false);
	// const [emailFocused, setEmailFocused] = useState(false);

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
	
	
	const printPass = (isValid) => {
		setStrong(isValid);
	};
	const checkEmail=async(e)=>{
		const newEmail = e.target.value;
		console.log(newEmail)
		setEmail(newEmail)
		
		
		let res =  await isValidEmail(newEmail);
		
		console.log(res)
		setValidEmail(res);
	}
	
	const checkSignUp = async () => {
		
		if (uName != "" && email != "" && password != "") {
			if(validEmail){
				if (isStrong) {
					const body = JSON.stringify({ uName, email, password });
	
					const res = await fetch("http://127.0.0.1:8000/register/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body,
					});
	
					if (res.status == 200) {
						swal
							.fire({
								icon: "success",
								title: "Welcome",
								text: "You are successfully Registered",
							})
							.then((res) => {
								navigateTo("/")
							});
					}else if(res.status==403){
						swal.fire({
							icon:"error",
							title:"User Exists",
							text:"User with given email exists"
						})
						.then((res)=>{
							navigateTo("/login")
						})

					}		
					else {
						swal
							.fire({
								icon: "error",
								title: "Error",
								text: "Cant Register now",
							})
							.then((res) => {
								navigateTo("/login")
							});
					}
				} else {
					swal.fire({
						icon: "warning",
						title: "Your Password is not much satisfying",
					});
				}
			}
			else{
				swal.fire({
					icon: "warning",
					title: "Your Email is not Valid",
				});
			}
			
		} else {
			swal.fire({
				icon: "warning",
				title: "Error",
				text: "Please fill all fields",
			});
		}
	};
	return (
		<>
			<form>
				<div className="welcome-part-signup">
					<h2>Create Account </h2>
				</div>
				<div className="input-part">
					<label>Name:</label>
					<div className="field-box">
						<span className="material-symbols-outlined field-icon">person</span>
						<input
							value={uName}
							className="field-input"
							type="text"
							id="uName"
							placeholder="Your Name"
							onChange={(e)=>setName(e.target.value)}
							
						/>
					</div>
					<label>Email:</label>
					<div className="field-box">
						<span className="material-symbols-outlined field-icon">mail</span>
						<input
							value={email}
							className="field-input"
							type="email"
							id="email"
							placeholder="Your Email"
							onInput={checkEmail}
							
							
						/>
						{validEmail?(<span
							className="material-symbols-outlined eye">
							check
						</span>):(<></>)}
						
					</div>

					<label>Password:</label>
					<div className="field-box">
						<span className="material-symbols-outlined field-icon">key</span>
						<input
							value={password}
							className="field-input"
							type={type}
							id="password"
							placeholder="New Password"
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => setInputFocused(true)}
          					onBlur={() => setInputFocused(false)}
						/>
						<span
							className="material-symbols-outlined eye"
							onClick={() => changeIcon()}
						>
							{icon}
						</span>
					</div>
					{inputFocused?(
						<div className="scroll-menu">
						<PasswordChecklist
							rules={["minLength", "specialChar", "number", "capital"]}
							minLength={8}
							value={password}
							className="strong-pass"
							onChange={(isValid) => {
								printPass(isValid);
							}}
							iconSize={14}
							
						/>
					</div>
					):
					(<>
						<div className="footer-part">
							<button className="signUp-button" type="button" onClick={checkSignUp}>
								Sign up
							</button>
							<div className="link">
								Have an account?{" "}
								<span data-value="Login" className="fw-bold" onClick={changePage}>
									Login In
								</span>
							</div>
						</div>
						
						
						</>
					)}
					
					
				</div>
				
			</form>
			
		</>
	);
}

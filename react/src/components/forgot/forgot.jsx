import React, { useState } from "react";
import Swal from "sweetalert2";
import { InputOtp } from "primereact/inputotp";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BounceLoader } from "react-spinners";

export default function Forgot() {
	const navigateTo = useNavigate();
	const [email, setEmail] = useState("");
	const [isclicked, setIsClicked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [token, setTokens] = useState("");
	const [otp, setOtp] = useState("");

	const checkUser = async () => {
		const body = JSON.stringify({ email });
		const res = await fetch("http://127.0.0.1:8000/check_user/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) return true;
		else {
			Swal.fire({
				icon: "error",
				title: "User not found",
				text: "Please check entered email!!",
			});
			return false;
		}
	};

	const sendMail = async () => {
		const body = JSON.stringify({ email });
		const res = await fetch("http://127.0.0.1:8000/reset_email/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) {
			const data = await res.json();
			let ogOtp = data.otp;
			setOtp(ogOtp);
			Swal.fire({
				icon: "success",
				title: "Otp Send",
				text: "Please check your email for the otp",
			});
		}
	};

	const resetPass = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const verifiedUser = await checkUser();
		if (verifiedUser) {
			await sendMail();
			setIsLoading(false);
			setIsClicked(true);
		} else {
			setIsLoading(false);
		}
	};
	const handleEmail = (e) => {
		setEmail(e.target.value);
	};
	const verifyOtp = () => {
		const otpLength = token.length;
		if (otpLength < 6) {
			alert("Please enter a 6 digit Otp");
		} else {
			if (token == otp) {
				Swal.fire({
					icon: "success",
					title: "Verified",
					text: "Entered otp is correct",
				});
				Cookies.set("otpVerified", true, {
					expires: 10 / (24 * 60),
					sameSite: "None",
					secure: true,
				});
				navigateTo("/resetPass", { state: { data: email } });
			} else {
				Swal.fire({
					icon: "error",
					title: "Failed!",
					text: "Entered otp is incorrect",
				});
			}
		}
	};
	return (
		<>
			{isLoading ? (
				<>
					<div
						className="d-flex justify-content-center align-items-center"
						style={{ height: "100vh" }}
					>
						<BounceLoader color="#36d7b7" loading={isLoading} size={60} />
					</div>
				</>
			) : (
				<>
					<div className="forgot-body">
						<div className="container">
							<div className="d-flex justify-content-center">
								<h1>Forgot Password?</h1>
							</div>

							<hr />
							{!isclicked ? (
								<>
									<div>
										<p>Please enter the email you registered with us :</p>
										<form onSubmit={resetPass}>
											<div>
												<input
													type="email"
													id="email"
													required
													className="w-25"
													onChange={handleEmail}
												/>
												<br />
												<button className="mt-2" type="submit">
													Submit
												</button>
											</div>
										</form>
									</div>
								</>
							) : (
								<>
									<div
										className="d-flex justify-content-center align-items-center"
										style={{ height: "80vh" }}
									>
										<div className="card d-flex justify-content-center w-50 h-50">
											<InputOtp
												style={{ display: "flex", justifyContent: "center" }}
												value={token}
												length={6}
												onChange={(e) => setTokens(e.value)}
												integerOnly
											/>
											<div className="d-flex justify-content-center w-100 mt-3 gap-2">
												<Button
													label="Resend Code"
													severity="secondary"
													raised
													onClick={sendMail}
												/>
												<Button
													label="Submit Code"
													raised
													onClick={verifyOtp}
												/>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function Dashboard() {
	const navigate = useNavigate();
	const [islogged, setIsLogged] = useState(false);
	const [loginFormData, setLoginFormData] = useState({
		username: "",
		password: "",
	});
	useEffect(() => {
    const adminLogged = Cookies.get("adminLogged");
  if (adminLogged) {
    setIsLogged(true);
  }
		const handleBackButton = (event) => {
			if (window.location.pathname === "/") {
				event.preventDefault();
			}
		};

		window.addEventListener("popstate", handleBackButton);
		return () => {
			window.removeEventListener("popstate", handleBackButton);
		};
	}, [islogged, navigate]);
	const { username, password } = loginFormData;
	const handleChange = (e) => {
		const { id, value } = e.target;
		setLoginFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const checkLogin = () => {
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
					setIsLogged(true);
					navigate("/dashboard");
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

	const handleLogOut = () => {
		setIsLogged(false);
		Cookies.remove("adminLogged");
	};

  const optionSelected=(option)=>{
	
    if(option==="add"){
      navigate("/addProduct")
    }
	else if(option==="view"){
		navigate("/viewProduct")
	}
	else if(option==="delete"){
		navigate("/deleteProduct")
	}
	
  }
	return (
		<>
			{!islogged ? (
				<>
					<div className="admin-login">
						<div className="login-block">
							<h3>cPhone Admin</h3>

							<div className="input-block ">
								<form>
									<div>
										<label htmlFor="user">Username</label>
										<br />
										<input
											type="text"
											id="username"
											onChange={handleChange}
											required
										/>
									</div>
									<div>
										<label htmlFor="password">Password</label>
										<br />
										<input
											type="password"
											id="password"
											onChange={handleChange}
											required
										/>
									</div>
									
									<br />
									<div className="d-flex justify-content-center">
										<button
											type="button"
											className="btn btn-outline-info"
											onClick={checkLogin}
										>
											Login
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
        <div className="dashboard-body">
          <div className="top-part">
							<div className="logout">
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleLogOut}
								>
									Log out
								</button>
							</div>
						</div>
			<div className="container">
						
            <div className="option-area">
			<div className="row d-flex justify-content-evenly">
            <div className="dashboard-option-box col-6" onClick={()=>optionSelected("add")} >
              <span className="material-symbols-outlined">
                add_circle
                </span>
                Add Products
              </div>
			  <div className="dashboard-option-box col-6" onClick={()=>optionSelected("view")}>
              <span className="material-symbols-outlined">
			  grid_view
                </span>
                View Products
              </div>
			  </div>
			  <div className="row pt-3 d-flex justify-content-evenly">
			  <div className="dashboard-option-box col-6" onClick={()=>optionSelected("delete")}>
              <span className="material-symbols-outlined">
                cancel
                </span>
                Delete Products
              </div>
			  <div className="dashboard-option-box col-6" onClick={()=>optionSelected("edit")}>
              <span className="material-symbols-outlined">
			  edit
                </span>
                Edit Products
              </div>
			  </div>
			  
            </div>
              
            </div>
              
            
          </div>
				</>
			)}
		</>
	);
}

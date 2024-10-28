import React, { useState, useEffect } from "react";
import "/src/assets/css/main.css";
import Login from "../login/login";
import SignUp from "../signup/signup";

export default function Home() {
  
  const [page, setPage] = useState("Login");

  const changePage = (event) => {
    const currentPage = event.target.getAttribute("data-value");
    if (currentPage == "SignUp") {
      setPage("SignUp");
    } else {
      setPage("Login");
    }
  };

  

  return (
    <div className="main-container">
      <div className="container-left ">
        <img src="src\assets\pic2.jpg" alt="Error" />
      </div>
      <div className="container-right">
        <div className="comp-logo">
          <img src="src\assets\icon-blue.png" alt="Error" width={35}/>
          <span>cPhone</span>
        </div>
        <div className="form-part">
          {page == "Login" ? (
             <>
              <Login changePage={changePage}/>
            </>
          ) : (
            <>
              <SignUp changePage={changePage}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./home.css";
import Login from "../login/login";
import SignUp from "../signup/signup";

export default function Home({ onClose }) {
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
      <div className="modal-body">
        <div className="form-part">
          {page === "Login" ? (
            <>
              <Login changePage={changePage} />
            </>
          ) : (
            <>
              <SignUp changePage={changePage} />
            </>
          )}
    
        </div>
        
      </div>
    
  );
}

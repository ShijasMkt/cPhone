import React from 'react'
import "./logout.css";
import Cookies from 'js-cookie';
import { useUser } from '../authentication/userContext';

export default function Logout() {
  const{logoutFunc}=useUser();
  const handleClick=()=>{
    logoutFunc()
  }
  return (
    <div>
        <button className="logout-button" onClick={handleClick}>
            Logout
        </button>
    </div>
  )
}







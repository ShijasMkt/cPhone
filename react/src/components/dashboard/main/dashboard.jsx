import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import "primeflex/primeflex.css";
import AdminNav from '../nav/adminNav';
import "./dashboard.css"
import { useState } from "react";
import swal from 'sweetalert2';
import { Outlet } from 'react-router-dom';
import DashboardBody from './dashboardBody';
        

export default function Dashboard() {
	
	
  return (
	<div>
	  <AdminNav/>
	  <div className="pt-top">
	  
          <Outlet />

	  </div>
	  
		
    
	</div>
  )
}



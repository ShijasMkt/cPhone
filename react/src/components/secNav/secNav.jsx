import React from 'react'
import { Sidebar } from "primereact/sidebar";
import Logout from '../logout/logout';
import "./secNav.css"
import { useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function SecNav() {
    const [visibleMenu, setVisibleMenu] = useState(false);
    const uName =Cookies.get("userName")
    const navigateTo=useNavigate();
    const showMenu=()=>{
		setVisibleMenu(true)
		
	}
    const menuPageChange=(option)=>{
		if(option==1){
			navigateTo('/address')
		}
		else{
			navigateTo('/orders')
		}
	}
  return (
    <>
      <nav>
					<div className="nav-container">
						<div className="d-flex">
							<div className="col-2 d-flex ">
								<span
									onClick={showMenu}
									className="material-symbols-outlined menu-icon"
								>
									menu
								</span>
								<Sidebar
									visible={visibleMenu}
									position="left"
									onHide={() => setVisibleMenu(false)}
									className="sidebar-left"
								>
									<div className="menu-box">
										<div className="menu-header">
											<h2>Hi, {uName}</h2>
											
										</div>
										<hr />
										<div className="menu-body">
                                        <div className="option-box" onClick={()=>menuPageChange(1)} >
												
												<span className="material-symbols-outlined">
												explore 
												</span>
												<span className="ms-1">Your Address</span>
												
											</div>
											<div className="option-box" onClick={()=>menuPageChange(2)}>
												
												<span className="material-symbols-outlined">
												orders 
												</span>
												<span className="ms-1">Your Orders</span>
												
											</div>
										</div>
										
										<div className="menu-footer">
                                                <Logout/>
										</div>
									</div>	
								</Sidebar>
								<div className="nav-logo">
								<a href="/">
									<img
										src="src\assets\icon-white.png"
										width="30"
										height="30"
										className="d-inline-block align-top nav-img"
										alt="React Bootstrap logo"
									/>
								</a>
								<a href='/' className="nav-span">cPhone</a>
								</div>
							</div>
							
							
						</div>
					</div>
				</nav>
    </>
  )
}

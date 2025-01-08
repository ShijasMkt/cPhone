import React,{useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import "./adminNav.css"
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { PanelMenu } from 'primereact/panelmenu';
import { Button } from 'primereact/button';
import Cookies from "js-cookie";
        
        


export default function AdminNav() {
    const navigateTo=useNavigate()
    const [visible, setVisible] = useState(false);
    const handleLogOut = () => {
		Cookies.remove("adminLogged");
        window.location='/admin'
		
	};
    let menuItems = [
        { label: 'Users', icon: 'pi pi-users' ,
			command:()=>{navigateTo('users')}},
        { label: 'Products', icon: 'pi pi-box' ,
			command:()=>{navigateTo('products')},
        },
        {label:'Orders',icon:'pi pi-shopping-cart',
			command:()=>{navigateTo('orders')}}
        ];
  return (
    <>
    <div className='adminNav'>
      <div className="navbar-top fixed-top">
				<nav className="navbar navbar-expand-xl">
					<div className="container">
						<div>
							<Link className="nav-logo" to="/admin">
								<h2 className="mb-0">cPhone Admin</h2>
							</Link>
						</div>

						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>

						<div
							className="collapse navbar-collapse"
							id="navbarNav"
							style={{ flexGrow: "0.5", justifyContent: "end" }}
						>
							<ul className="navbar-nav gap-3 align-items-center">
								
								<li className="nav-item">
                                <span
										onClick={() => setVisible(true)}
										className="material-symbols-outlined "
									>
										menu
									</span>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
    </div>
    <Sidebar visible={visible} onHide={() => setVisible(false)}>
                
                <div className="sidebar-body">
                <h2>Hello Admin</h2>
                <PanelMenu model={menuItems} />
                
                </div>
                <Button label="Logout" icon="pi pi-sign-out" severity='danger' onClick={handleLogOut}/>
            </Sidebar>
    </>
  )
}

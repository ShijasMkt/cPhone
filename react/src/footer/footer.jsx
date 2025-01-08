import React from 'react'
import 'primeicons/primeicons.css';
import "./footer.css";
        

export default function Footer() {
  return (
    <div className='footer'>
      
    <footer>
    <hr />
        <div className="container">
        
        <div className="footer-body">
        
            <p className='mb-0 mt-0'>© 2021 cPhone, Inc</p>
            <img src="src\assets\icon-blue.png" width={30} height={30} alt="" />
            <div className='footer-icons'>
            <i className='pi pi-instagram'></i>
            <i className='pi pi-facebook'></i>
            <i className='pi pi-linkedin'></i>

            </div>
            
        </div>
        </div>
        
    </footer>
    </div>
  )
}

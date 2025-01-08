import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SecNav from "../secNav/secNav";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function ResultPage() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const { data } = location.state || [];
    const {search}=location.state ||[];

    useEffect(()=>{
        console.log(data)
    },[])
    const toBuyNowPage = (phone) => {
		phone.qty=1
		var data = [phone]
		navigateTo("/buyNow", { state: { data: data } });
	};

    
	const toViewPage = (phone) => {
		var data=[phone]
		navigateTo("/purchase", { state: { data: data } });
	};
  return (
    <div className='result-body pt-top'>
        <SecNav/>
        <div className="container">
            <div>
                <h4>You searched for "{search}" :</h4>
            </div>
        <div className="row">
        {!data.length==0?
        <>
            {data.map((phone) => (
            
            <div
                key={phone.id}
                className="col-3 product-card"
            >
                <div className="card p-2">
                    
    
                    <div
                        className="card-img-box"
                        onClick={() => toViewPage(phone)}
                    >
                        <img
                            className="card-img"
                            src={`http://127.0.0.1:8000${phone.img}`}
                            alt=""
                        />
                    </div>
    
                    <div className="card-body">
                        <h6 className="card-title fw-bold">{phone.name}</h6>
                        <p className="card-text mb-1">₹ {phone.price}</p>
                        
                    </div>
                </div>
            </div>
        ))}
        </>:<>
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <p className='p-3'>&#128546; No products found for Your search!!</p>
            <h6>Explore our latest products <Link to="/">here</Link></h6>
        </div>
            
        </>}
        
    </div>
        </div>
    </div>
  )
}

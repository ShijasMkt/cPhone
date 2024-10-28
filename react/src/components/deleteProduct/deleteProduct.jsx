import React, { useState, useEffect } from "react";
import "./deleteProduct.css";
import Swal from "sweetalert2";

export default function DeleteProduct() {
	const [phones, setPhones] = useState([]);
    const fetchPhones = async () => {
        const res = await fetch("http://127.0.0.1:8000/phones/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please come back again",
            });
        }
        const data = await res.json();
        setPhones(data);
    };
	useEffect(() => {
		fetchPhones();
	}, []);

    const deleteProduct=async(itemID)=>{
        const body=JSON.stringify({itemID})
        const res = await fetch("http://127.0.0.1:8000/delete_product/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body
        });
        if(res.status==200)
        {
            Swal.fire({
				icon: "success",
				title: "Deletion Successfull !!",
				text: "Selected Product successfully deleted",
			});
            fetchPhones();
        }
        else{
            Swal.fire({
				icon: "error",
				title: "Opps..",
				text: "Can't Delete the product at this moment.",
			});
        }
    }
	return (
		<>
			<div className="d-flex justify-content-center pt-3">
				<h2>
					<b>Delete Products</b>
				</h2>
			</div>
			<hr />

			<div className="container">
				
					{phones.length > 0 ? (
						<>
                        <div className="row">
							{phones.map((list) => (
                                <div className="col-6 d-flex justify-content-center">
								<div className="pdt-delete-box " key={list.id}>
									
										
											<div className="row">
												<div className="col-4">
													<div className="pdt-delete-img">
														<img
															src={`http://127.0.0.1:8000${list.img}`}
															alt=""
															className="pdt-img"
														/>
													</div>
												</div>
												<div className="col-4 d-flex align-items-center">
													<div className="d-block">
														<h6>
															<b>{list.name}</b>
														</h6>
														<h6>
															Price :<b>{list.price}</b>{" "}
														</h6>
													</div>
												</div>
												<div className="col-4 pdt-delete-btn-col">
													<button type="button" className="btn btn-danger" onClick={()=>deleteProduct(list.id)}>
														Delete
													</button>
												</div>
											</div>
										
										
									
								</div>

                                </div>
							))}
                            </div>
						</>
					) : (
						<></>
					)}
					<div />
				
			</div>
		</>
	);
}

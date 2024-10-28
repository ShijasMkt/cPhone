import React, { useState, useEffect } from "react";
import "./viewProduct.css";

export default function ViewProduct() {
	const [phones, setPhones] = useState([]);
	useEffect(() => {
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

		fetchPhones();
	}, []);
	return (
		<>
        
        <div className="d-flex justify-content-center pt-3">
        <h2><b>Products</b></h2>
        </div>
        <hr />

        <div className="container">
        
			<div className="pdt-items">
				{phones.length > 0 ? (
					<>
						{phones.map((list) => (
							<div className="pdt-item-box " key={list.id}>
								<div className="row">
									<div className="col-3">
                                        <div className="pdt-item-img">
                                        <img
											src={`http://127.0.0.1:8000${list.img}`}
											alt=""
											className="pdt-img"
										/>
                                        </div>
										
									</div>
									<div className="col-3">
										<div className="d-block">
											<h6>
												<b>{list.name}</b>
											</h6>
											<h6>
												Price :<b>{list.price}</b>{" "}
											</h6>
											
										</div>
									</div>
									<div className="col-6">
										<b>Description:</b> {list.desc}
									</div>
								</div>
							</div>
						))}
					</>
				) : (
					<></>
				)}
				<div />
			</div>
            </div>
		</>
	);
}

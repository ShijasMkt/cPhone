import React, { useState, useEffect } from "react";
import "./deleteProduct.css";
import Swal from "sweetalert2";
import { ConfirmDialog } from 'primereact/confirmdialog';

export default function DeleteProduct() {
	const [visible, setVisible] = useState(false);
	const [phones, setPhones] = useState([]);
	const [selectedItemID, setSelectedItemID] = useState(null);

	const fetchPhones = async () => {
		const res = await fetch("http://127.0.0.1:8000/phones/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!res.ok) {
			Swal.fire({
				icon: "error",
				title: "Network Error",
				text: "Please come back again",
			});
		} else {
			const data = await res.json();
			setPhones(data);
		}
	};

	useEffect(() => {
		fetchPhones();
	}, []);

	const handleDeleteClick = (itemID) => {
		// Set the item to be deleted and show the confirmation dialog
		setSelectedItemID(itemID);
		setVisible(true);
	};

	const deleteProduct = async (itemID) => {
		const body = JSON.stringify({ itemID });
		const res = await fetch("http://127.0.0.1:8000/delete_product/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});

		if (res.status === 200) {
			Swal.fire({
				icon: "success",
				title: "Deletion Successful!",
				text: "Selected product successfully deleted.",
			});
			fetchPhones();
		} else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Can't delete the product at this moment.",
			});
		}
	};

	const handleAccept = () => {
		if (selectedItemID) {
			// Proceed with the deletion if the user confirms
			deleteProduct(selectedItemID);
		}
		setVisible(false);
	};

	const handleReject = () => {
		// Reset the selected item ID if the user cancels
		setSelectedItemID(null);
		setVisible(false);
	};

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
								<div className="col-6 d-flex justify-content-center" key={list.id}>
									<div className="pdt-delete-box">
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
														Price : <b>{list.price}</b>
													</h6>
												</div>
											</div>
											<div className="col-4 pdt-delete-btn-col">
												<button
													type="button"
													className="btn btn-danger"
													onClick={() => handleDeleteClick(list.id)}
												>
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
					<p>No products available for deletion.</p>
				)}
			</div>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				group="declarative"
				visible={visible}
				onHide={() => setVisible(false)}
				message="Are you sure you want to delete this product?"
				header="Confirmation"
				icon="pi pi-exclamation-triangle"
				accept={handleAccept}
				reject={handleReject}
				style={{ width: "50vw" }}
				breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
			/>
		</>
	);
}

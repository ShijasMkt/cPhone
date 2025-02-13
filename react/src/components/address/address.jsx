import React, { useEffect } from "react";
import SecNav from "../secNav/secNav";
import "./address.css";
import { useState } from "react";
import Cookies from "js-cookie";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Footer from "../../footer/footer";
import { Dialog } from 'primereact/dialog';
        

export default function Address() {
	const navigateTo=useNavigate();
	const userID = Cookies.get("userID");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [formData, setFormData] = useState({
		fname: "",
		lname: "",
		mobile: "",
		pincode: "",
		address: "",
		type: "Home",
	});
	const { fname, lname, mobile, pincode, address, type } = formData;
	const [addressList, setAddressList] = useState([]);
	const [selectedAddress,setSelectedAddress]=useState({});
	const [refresh, setRefresh] = useState(false);
	const[editVisible,setEditVisible]=useState(false);
	useEffect(()=>{
		showAddress();
	},[])
	useEffect(() => {
		showAddress();
	
	}, [isFormVisible]);

	const showAddress = async () => {
		const body = JSON.stringify({ userID });
		const res = await fetch("http://127.0.0.1:8000/show_address/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (!res.ok) {
			swal.fire({
				icon: "error",
				title: "Network Error",
				text: "Please come back again",
			});
		}
		const data = await res.json();
		setAddressList(data);
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const handleRadioChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			type: e.target.value,
		}));
	};

	const saveAddress = async () => {
		if (fname=="" || lname=="" || mobile==null || pincode==null || address=="") {
			alert("Please fill all fields");
		} else {
			const body = JSON.stringify({ formData, userID });
			const res = await fetch("http://127.0.0.1:8000/address/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			setRefresh(true)

			if (res.status == 200) {
				swal
					.fire({
						icon: "success",
						title: "Saved",
						text: "Address saved successfully",
					})
					showAddress();
			}
		}
	};

	const editAddress=async()=>{
		if (fname=="" || lname=="" || mobile==null || pincode==null || address=="") {
			alert("Please fill all fields");
		} else {
			const body = JSON.stringify({ formData});
			const res = await fetch("http://127.0.0.1:8000/edit_address/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if(res.ok)
			{
				setFormData({fname: "",
					lname: "",
					mobile: "",
					pincode: "",
					address: "",
					type: "Home",})
				showAddress()
				setEditVisible(false)
			}
		}
	}

	const deleteAddress = async (addressID) => {
		const body = JSON.stringify({ userID, addressID });
		const res = await fetch("http://127.0.0.1:8000/delete_address/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) {
			swal
				.fire({
					icon: "success",
					title: "Successfull",
					text: "Address deleted successfully",
				})
				showAddress()
		}
	};
	return (
		<>
			<SecNav />
			<div className="address-body pt-top">
				<div className="container">
					<div className="add-address-box">
						<div
							className="add-address-header"
							onClick={() => setIsFormVisible(true)}
						>
							<span className="material-symbols-outlined">add</span>
							<span>ADD A NEW ADDRESS</span>
						</div>

						<div
							className={`${
								isFormVisible ? "add-address-form" : "add-address-form d-none"
							}`}
						>
							<form action="">
								<div className="row">
									<div className="col-4">
										<div className="form-floating mb-3">
											<input
												type="text"
												className="form-control"
												id="fname"
												placeholder=""
												value={fname}
												onChange={handleChange}
											/>
											<label htmlFor="fname" className="mt-0">
												First Name
											</label>
										</div>
									</div>
									<div className="col-4">
										<div className="form-floating mb-3">
											<input
												type="text"
												className="form-control"
												id="lname"
												placeholder=""
												value={lname}
												onChange={handleChange}
											/>
											<label htmlFor="lname" className="mt-0">
												Last Name
											</label>
										</div>
									</div>
									<div className="col-4">
										<div className="form-floating mb-3">
											<input
												type="text"
												className="form-control"
												id="mobile"
												placeholder=""
												value={mobile}
												onChange={handleChange}
												maxLength={10}
                        
											/>
											<label htmlFor="mobile" className="mt-0">
												10-Digit mobile number
											</label>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-4">
										<div className="form-floating mb-3">
											<input
												type="text"
												className="form-control"
												id="pincode"
												placeholder=""
												value={pincode}
												onChange={handleChange}
												maxLength={6}
											/>
											<label htmlFor="pincode" className="mt-0">
												Pincode
											</label>
										</div>
									</div>
									<div className="col-8">
										<div className="form-floating mb-3">
											<input
												type="text"
												className="form-control"
												id="address"
												placeholder=""
												value={address}
												onChange={handleChange}
											/>
											<label htmlFor="address" className="mt-0">
												Address
											</label>
										</div>
									</div>
								</div>
								<span>Address Type</span>
								<div className="d-flex mt-3">
									<div className="form-check">
										<input
											className="form-check-input"
											type="radio"
											name="flexRadioDefault"
											id="Home"
											value="Home"
											checked={type === "Home"}
											onChange={handleRadioChange}
										/>
										<label className="form-check-label mt-0" htmlFor="Home">
											Home
										</label>
									</div>
									<div className="form-check ms-2">
										<input
											className="form-check-input"
											type="radio"
											name="flexRadioDefault"
											id="work"
											value="Work"
											checked={type === "Work"}
											onChange={handleRadioChange}
										/>
										<label className="form-check-label mt-0" htmlFor="work">
											Work
										</label>
									</div>
								</div>
							</form>
							<div className="form-footer">
								<button
									type="button"
									className="save-button"
									onClick={saveAddress}
								>
									SAVE
								</button>
								<span onClick={() => setIsFormVisible(false)}>CANCEL</span>
							</div>
						</div>
					</div>
					<div className="address-display">
						{addressList.length > 0 ? (
							<>
								{addressList.map((list) => (
									<div className="address-display-card" key={list.id}>
										<div className="row" >
											<div className="col-10">
												<span className="card-span">{list.type}</span>
												<div className="card-title">
													{list.fname} {list.lname} {list.mobile}
												</div>
												<div className="card-text">
													{list.address} - <b>{list.pincode}</b>
												</div>
											</div>
											<div className="col-2 card-button">
												<button type="button" className="btn btn-light btn-sm" onClick={()=>{setEditVisible(true);setFormData(list);}}>
													<span className="material-symbols-outlined check" >edit</span>
												</button>
												<Dialog  header="Edit" visible={editVisible}  onHide={() => setEditVisible(false)}>
													<form action="">
														<div className="row">
															<div className="col-4">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className="form-control"
																		id="fname"
																		placeholder=""
																		value={formData.fname}
																		onChange={handleChange}
																	/>
																	<label htmlFor="fname" className="mt-0">
																		First Name
																	</label>
																</div>
															</div>
															<div className="col-4">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className="form-control"
																		id="lname"
																		placeholder=""
																		value={formData.lname}
																		onChange={handleChange}
																	/>
																	<label htmlFor="lname" className="mt-0">
																		Last Name
																	</label>
																</div>
															</div>
															<div className="col-4">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className="form-control"
																		id="mobile"
																		placeholder=""
																		value={formData.mobile}
																		onChange={handleChange}
																		maxLength={10}
												
																	/>
																	<label htmlFor="mobile" className="mt-0">
																		10-Digit mobile number
																	</label>
																</div>
															</div>
														</div>
														<div className="row">
															<div className="col-4">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className="form-control"
																		id="pincode"
																		placeholder=""
																		value={formData.pincode}
																		onChange={handleChange}
																		maxLength={6}
																	/>
																	<label htmlFor="pincode" className="mt-0">
																		Pincode
																	</label>
																</div>
															</div>
															<div className="col-8">
																<div className="form-floating mb-3">
																	<input
																		type="text"
																		className="form-control"
																		id="address"
																		placeholder=""
																		value={formData.address}
																		onChange={handleChange}
																	/>
																	<label htmlFor="address" className="mt-0">
																		Address
																	</label>
																</div>
															</div>
														</div>
														<span>Address Type</span>
														<div className="d-flex mt-3">
															<div className="form-check">
																<input
																	className="form-check-input"
																	type="radio"
																	name="flexRadioDefault"
																	id="Home"
																	value="Home"
																	checked={formData.type === "Home"}
																	onChange={handleRadioChange}
																/>
																<label className="form-check-label mt-0" htmlFor="Home">
																	Home
																</label>
															</div>
															<div className="form-check ms-2">
																<input
																	className="form-check-input"
																	type="radio"
																	name="flexRadioDefault"
																	id="work"
																	value="Work"
																	checked={formData.type === "Work"}
																	onChange={handleRadioChange}
																/>
																<label className="form-check-label mt-0" htmlFor="work">
																	Work
																</label>
															</div>
														</div>
													</form>
													<div className="form-footer">
														<button
															type="button"
															className="save-button"
															onClick={editAddress}
														>
															SAVE
														</button>
														<span onClick={() => setEditVisible(false)}>CANCEL</span>
													</div>
												</Dialog>
												<button
													type="button"
													className="btn btn-danger"
													onClick={() => deleteAddress(list.id)}
												>
													Delete
												</button>
												
											</div>
										</div>
									</div>
								))}
							</>
						) : (
							<>
								<div className="no-address">
									<p>No Address Found</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			
			<Footer />
		</>
	);
}

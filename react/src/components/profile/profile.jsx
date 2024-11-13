import React, { useEffect, useState, useRef } from "react";
import SecNav from "../secNav/secNav";
import "./profile.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { drawImageOnCanvas } from "../../utils";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useUser } from "../authentication/userContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
	const navigateTo = useNavigate();
	const { logoutFunc } = useUser();
	const [configVisible, setConfigVisible] = useState(false);
	const [nameEditClicked, setNameEdit] = useState(false);
	const [imgEditClicked, setImgEdit] = useState(false);
	const [userDetails, setUserDetails] = useState({
		name: "",
		email: "",
		password: "",
		user_img: null,
	});
	const { name, user_img } = userDetails;
	const userID = Cookies.get("userID");

	const [imgSrc, setImgSrc] = useState();
	const [crop, setCrop] = useState({
		unit: "%",
		width: 75,
		height: 75,
		x: 10,
		y: 10,
	});
	const [completedCrop, setCompletedCrop] = useState(null);

	const imgRef = useRef(null);
	const canvasRef = useRef(null);

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				const img = new Image();
				img.src = reader.result;

				img.onload = () => {
					// Set the threshold for image size (optional, can be adjusted based on requirement)
					const maxWidth = 500;
					const maxHeight = 500;
					let scaleFactor = 1;

					if (img.width > maxWidth || img.height > maxHeight) {
						const scaleX = maxWidth / img.width;
						const scaleY = maxHeight / img.height;
						scaleFactor = Math.min(scaleX, scaleY);
					}

					// Create a canvas to draw the resized image
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					// Set canvas dimensions based on scale factor
					canvas.width = img.width * scaleFactor;
					canvas.height = img.height * scaleFactor;

					// Draw the image onto the canvas
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

					// Get the resized image as a data URL
					const resizedImage = canvas.toDataURL();
					setImgSrc(resizedImage); // Update the state with the resized image

					// Calculate aspect ratio and set crop settings dynamically based on image size
					const aspectRatio = img.width / img.height;
					setCrop({
						unit: "%",
						width: 75, // Default width, this can be adjusted
						height: 75, // Default height, this can be adjusted
						x: 10, // Default position (can be adjusted)
						y: 10, // Default position (can be adjusted)
					});
				};
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const handleCompleteCrop = (crop) => {
		drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
		setCompletedCrop(crop);
	};

	const canvasStyles = {
		width: Math.round(completedCrop?.width ?? 0),
		height: Math.round(completedCrop?.height ?? 0),
		borderRadius: "50%",
	};
	const getCroppedImageBlob = () => {
		if (!completedCrop || !canvasRef.current) return null;
		return new Promise((resolve) => {
			canvasRef.current.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/jpeg",
				1
			);
		});
	};

	useEffect(() => {
		if (userID) {
			showDetails();
		}
	}, [userID]);

	const showDetails = async () => {
		const body = JSON.stringify({ userID });
		try {
			const res = await fetch("http://127.0.0.1:8000/user_details/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});

			if (!res.ok) {
				throw new Error("Failed to fetch user details");
			}

			const data = await res.json();
			if (data.userData) {
				setUserDetails(data.userData); // Update state with fetched data
			} else {
				Swal.fire({
					icon: "error",
					title: "No User Data Found",
					text: "Please try again later.",
				});
			}
		} catch (error) {
			console.error("Error fetching user details:", error);
			Swal.fire({
				icon: "error",
				title: "Network Error",
				text: "Please try again later.",
			});
		}
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setUserDetails((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const editProfile = async (option) => {
		try {
			if (option === "name") {
				const body = JSON.stringify({ userID, name, option });
				const res = await fetch("http://127.0.0.1:8000/user_details_update/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body,
				});

				if (res.status === 200) {
					Swal.fire({
						icon: "success",
						title: "Updated!",
						text: "Your username is updated",
					});
				}
				setNameEdit(false);
			} else if (option === "img" && completedCrop) {
				const blob = await getCroppedImageBlob();
				if (!blob) {
					Swal.fire({
						icon: "error",
						title: "Crop Error",
						text: "Unable to retrieve cropped image.",
					});
					return;
				}

				const data = new FormData();
				data.append("userID", userID);
				data.append("user_img", blob, "profile_image.jpg");
				data.append("option", option);

				const res = await fetch("http://127.0.0.1:8000/user_details_update/", {
					method: "POST",
					body: data,
				});

				if (res.status === 200) {
					Swal.fire({
						icon: "success",
						title: "Updated!",
						text: "Your profile photo is updated",
					});
				}
				setImgEdit(false);
				showDetails();
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			Swal.fire({
				icon: "error",
				title: "Update Failed",
				text: "Please try again later.",
			});
		}
	};

	const deleteAccount = async () => {
		const body = JSON.stringify({ userID });
		const res = await fetch("http://127.0.0.1:8000/delete_account/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
		if (res.status == 200) {
			Swal.fire({
				icon: "success",
				title: "Account Deleted!!",
				text: "Your Account is deleted successfully",
			}).then(logoutFunc());
		}
	};

	const handleAccept = () => {
		setConfigVisible(false);
		deleteAccount();
	};

	return (
		<div className="profile-body pt-top">
			<SecNav />
			<div className="container">
				<div className="profile-details">
					<div className="profile-section">
						<div className="profile-headings">
							<h5 className="mb-0">User Name</h5>{" "}
							{!nameEditClicked ? (
								<span onClick={() => setNameEdit(true)}>Edit</span>
							) : (
								<span onClick={() => setNameEdit(false)}>Cancel</span>
							)}
						</div>
						<div className="row mt-2">
							<div className="col-4">
								<input
									id="name"
									className="form-control"
									type="text"
									placeholder=""
									value={userDetails.name}
									onChange={handleChange}
									disabled={!nameEditClicked}
								/>
							</div>
							{nameEditClicked ? (
								<div className="col-8">
									<button
										type="submit"
										className="btn btn-primary"
										onClick={() => editProfile("name")}
									>
										SAVE
									</button>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
					<div className="profile-section">
						<div className="profile-headings">
							<h5 className="mb-0">Email Address</h5>
						</div>
						<div className="row mt-2">
							<div className="col-4">
								<input
									id="email"
									className="form-control"
									type="text"
									placeholder=""
									value={userDetails.email}
									disabled
								/>
							</div>
						</div>
					</div>
					<div className="profile-section">
						<div className="profile-headings">
							<h5 className="mb-0">Profile Photo</h5>{" "}
							{!imgEditClicked ? (
								<span onClick={() => setImgEdit(true)}>Edit</span>
							) : (
								<span onClick={() => setImgEdit(false)}>Cancel</span>
							)}
						</div>
						<div className="row mt-2">
							{imgEditClicked ? (
								<>
									<div className="col-12">
										<input
											type="file"
											id="user_img"
											accept="image/*"
											required
											onChange={handleFileSelect}
										/>
									</div>
									<div className="CropperWrapper">
										<ReactCrop
											crop={crop}
											onChange={setCrop}
											aspect={1}
											onComplete={handleCompleteCrop}
											locked={true}
											circularCrop={true}
										>
											{imgSrc && (
												<img ref={imgRef} src={imgSrc} alt="cropper image" />
											)}
										</ReactCrop>
										{!imgSrc && <p className="InfoText">Choose file to crop</p>}
										<div className="CanvasWrapper">
											{/* Canvas to display cropped image */}
											<canvas ref={canvasRef} style={canvasStyles} />
										</div>
									</div>

									<div className="col-12 mt-2 ms-2">
										<button
											type="submit"
											className="btn btn-primary"
											onClick={() => editProfile("img")}
										>
											SAVE
										</button>
									</div>
								</>
							) : (
								<>
									{userDetails.user_img && (
										<div className="col-12">
											<img
												src={`http://127.0.0.1:8000${userDetails.user_img}`}
												alt=""
												className="userImg"
											/>
										</div>
									)}
								</>
							)}
						</div>
					</div>
					<div className="profile-section mb-2">
						<div className="row mt-2">
							<div className="col-4">
								<span
									className="delete-acc"
									onClick={() => setConfigVisible(true)}
								>
									Delete Account
								</span>
							</div>
						</div>
						<ConfirmDialog
							group="declarative"
							visible={configVisible}
							onHide={() => setConfigVisible(false)}
							message="Are you sure you want to delete this account?"
							header="Confirmation"
							icon="pi pi-exclamation-triangle"
							accept={handleAccept}
							reject={() => setConfigVisible(false)}
							style={{ width: "50vw" }}
							breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

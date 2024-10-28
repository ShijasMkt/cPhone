import React from 'react'
import PasswordChecklist from "react-password-checklist";
import { useState} from "react";
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



export default function ResetPass() {
    const navigateTo = useNavigate();
	const [inputFocused, setInputFocused] = useState(false);
    const [isStrong, setStrong] = useState(false);
	const [password, setPassword] = useState("");
    const [rePass,setRePass]=useState("");
    const location=useLocation();
    const { data } = location.state || {};

    const printPass = (isValid) => {
		setStrong(isValid);
	};
    const resetPass=async(e)=>{
        e.preventDefault();
        const email=data;
        if(password==rePass){
            const body = JSON.stringify({ email,password });
		    const res = await fetch("http://127.0.0.1:8000/reset_pass/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
        if(res.status==200){
            Swal.fire({
                icon: "success",
                title: "Password Reset!!",
                text: "You have successfully reset your password",
            })
            .then(
                Cookies.remove('otpVerified'),
                navigateTo("/")
            )
                
            
        }
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Password doesn't match",
                text: "Please check the passwords and try again!!",
            });
        }
    }
  return (
    <>
    <div className="reset-body">
    <div className="container">
    <div className="d-flex justify-content-center">
		<h1>Reset your password</h1>
    </div>
    <hr />
    <div style={{height:'75vh'}} className='align-content-center'>
    <div className='d-flex justify-content-center align-items-center'>
        <div className="card p-3 w-50 h-75 position-relative">
            <form onSubmit={resetPass}>
               
                <div className='d-flex gap-2 mt-2 justify-content-center '>
                <label htmlFor="pass" className='mt-1'>Password:</label>
                <input type="password" id='pass' required placeholder='Enter your new password' 
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
                </div>
                {inputFocused?<>
                    <div className="password-checklist-container">
						<PasswordChecklist
							rules={["minLength", "specialChar", "number", "capital"]}
							minLength={8}
							value={password}
							className="strong-pass"
							onChange={(isValid) => {
								printPass(isValid);
							}}
							iconSize={14}
							
						/>
					</div>
                </>:<></>}

                <div className='d-flex gap-2 mt-2 justify-content-center'>
                <label htmlFor="rePass" className='mt-1'>Reenter Password:</label>
                <input type="password" id='rePass' required onChange={(e) => setRePass(e.target.value)}/>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                <button type="submit" className="btn btn-primary">Reset</button>
                </div>
                
                
            </form>
        </div>
    </div>
    </div>
    
    </div>
    </div>
      
    </>
  )
}

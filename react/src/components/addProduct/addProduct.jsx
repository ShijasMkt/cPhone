import React,{useState} from 'react'
import "./addProduct.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        desc: '',
        img: null,
      });

    const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};
    const handleFileChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          img: e.target.files[0]
        }));
      }

      const handleSubmit = async (e) => {
        e.preventDefault();
        price=parseInt(price)
        const data =new FormData();
        data.append('name',formData.name)
        data.append('price',formData.price)
        data.append('desc',formData.desc)
        data.append('img',formData.img)

        

        try{
          const res = await fetch("http://127.0.0.1:8000/add_product/", {
            method: "POST",
            body: data, 
          });

          if(res.status==200){
            Swal.fire({
              icon: "success",
              title: "Product Added",
              text: "you've successfully added a product",
            })
            .then(
              navigate('/dashboard')
            )
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Opps...",
              text: "There was a error adding product",
            }) 
            .then(
              navigate("/dashboard")
            )
          }
			
        }
        catch{
            console.log("Error")
        }
      }
       
    

    


  return (
    <>
      <div className="add-product-home">
        <div className='add-product-body'>
        
        <div className='add-product'>
          <div className="container">
        <h3>Add Products</h3>
        <hr />
          <div className='product-input'>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-4">
                  <label htmlFor="name">Phone Name: </label>
                  <input type="text"  id='name' required onChange={handleChange}/>
                </div>
                <div className="col-4">
                  <label htmlFor="price">Price: </label>
                  <input type="number" id='price' required onChange={handleChange}/>
                </div>
                <div className="col-4">
                  <label htmlFor="img">Select Image: </label>
                  <input type="file" id='img' accept="image/*" required onChange={handleFileChange}/>
                </div>
                <div className="col-12 desc">
                <label htmlFor="desc">Product Description: </label>
                <textarea id='desc' rows={10} cols={50} required onChange={handleChange}/>
                </div>
                
              </div>
              <div className='d-flex justify-content-center pt-2'>
              <button type="submit" className="btn btn-success save">Save</button>
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

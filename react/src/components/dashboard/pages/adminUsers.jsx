import React, { useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import "./adminPages.css"
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Swal from 'sweetalert2';
        

        

export default function AdminUsers() {
    const toast=useRef(null)
    const [users,setUsers]=useState([])
    const [showAddressDialog,setAddressDialog]=useState(false)
    const [userAddress,setUserAddress]=useState()
    const [showDeleteAddressDialog,setDeleteAddressDialog]=useState(false)
    const [showDeleteUserDialog,setDeleteUserDialog]=useState(false)
    const [selectedAddress,setSelectedAddress]=useState()
    const [selectedUser,setSelectedUser]=useState()

    useEffect(()=>{
        fetchUsers();
    },[])
   
   
    const fetchUsers=async()=>{
        const res = await fetch("http://127.0.0.1:8000/dashboard/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(res.ok){
            const data = await res.json();
            setUsers(data)
        }
    }

    const fetchAddress=async(userID)=>{
        const body = JSON.stringify({ userID });
		const res = await fetch("http://127.0.0.1:8000/show_address/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
        if(res.ok){
            const data = await res.json();
            setUserAddress(data)
        }
    }

    const showAddress=(user)=>{
        setAddressDialog(true)
        fetchAddress(user.id)
    }

    const closeAddressDialog=()=>{
        setAddressDialog(false)
        setUserAddress(null)
    }

    const deleteAddress=async()=>{
        const userID=selectedAddress.user_id
        const addressID=selectedAddress.id
        const body = JSON.stringify({ userID, addressID });
		const res = await fetch("http://127.0.0.1:8000/delete_address/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});
        if (res.status == 200) {          
            toast.current.show({severity:'success', summary: 'Deleted', detail:'Address Deleted Successfully', life: 3000});
            fetchAddress(userID)
            setDeleteAddressDialog(false)
                            
        }
    }

    const deleteUser=async()=>{
        const userID=selectedUser.id
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
                        text: "User Account is deleted successfully",
                    })
                        fetchUsers()
                        setDeleteUserDialog(false)
                        
                    
                    
                }
    }


    const userImg = (user) => {
        if(user.user_img!=null)
        {
            return <img src={`http://127.0.0.1:8000${user.user_img}`}  className='table-img'/>;
        }
        else{
            return <p>No Image</p>
        }
        
    };

    const tableHeader=(<div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Users</span>
    </div>)
    const addressTemplate=(user)=>{
        return(
            <>
            <Button label='Addresses' icon='pi pi-external-link' outlined onClick={()=>showAddress(user)}></Button>
            </>
        )
    }
    const confirmDeleteAddress=(address)=>{
        setSelectedAddress(address)
        setDeleteAddressDialog(true)
    }

    const confirmDeleteUser=(user)=>{
        setSelectedUser(user)
        setDeleteUserDialog(true)
    }
    
    const deleteAdressTemplate = (rowData) => {
        return (
            <React.Fragment>
                
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAddress(rowData)} />
            </React.Fragment>
        );
    };
    const deleteAddressDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={()=>setDeleteAddressDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteAddress} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={()=>setDeleteUserDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    const closeDeleteAddress=()=>{
        setDeleteAddressDialog(false)
    }
    const closeDeleteUser=()=>{
        setDeleteUserDialog(false)
    }
    
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

  return (
    <div>
        <div className="container">
        <Toast ref={toast}/>
        
        <div className='card'>
        <DataTable value={users}  tableStyle={{ minWidth: '50rem'}} showGridlines paginator rows={4} header={tableHeader}>
                <Column field="id" sortable header="Id"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column body={addressTemplate} ></Column>
                <Column header="Image" body={userImg}></Column>
                <Column body={actionBodyTemplate}  style={{ minWidth: '3rem' }}></Column>
                
        </DataTable>
        </div>
        </div>
      <Dialog visible={showAddressDialog} onHide={closeAddressDialog} header="Adresses" >
        <div className="card">
            {userAddress?
            <>
            <DataTable value={userAddress} > 
                <Column field='id' header='Id'></Column>
                <Column field='fname' header='First Name'></Column>
                <Column field='lname' header='Last Name'></Column>
                <Column field='mobile' header='Mobile No.'></Column>
                <Column field='pincode' header='Pincode'></Column>
                <Column field='address' header='Address'></Column>
                <Column field='type' header='Type'></Column>
                <Column body={deleteAdressTemplate}  ></Column>

            </DataTable>
            </>:
            <>
            <div className="p-2">No Address Available</div>
            </>}
            
        </div>
      </Dialog>
      <Dialog visible={showDeleteAddressDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} footer={deleteAddressDialogFooter} header="Confirm" modal  onHide={closeDeleteAddress}>
                      <div className="confirmation-content">
                          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                          
                              <span>
                                  Are you sure you want to delete this address ?
                              </span>
                          
                      </div>
            </Dialog>
            <Dialog visible={showDeleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} footer={deleteUserDialogFooter} header="Confirm" modal  onHide={closeDeleteUser}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        
                            <span>
                                Are you sure you want to delete this address ?
                            </span>
                        
                    </div>
            </Dialog>
    </div>
  )
}

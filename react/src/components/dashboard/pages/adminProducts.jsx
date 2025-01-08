import React, { useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import AddProduct from '../sub-pages/addProduct/addProduct';
import Swal from 'sweetalert2';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
        
        
        

export default function AdminProducts() {
    const[phones,setPhones]=useState([])
    const [addVisible,setAddVisible]=useState(false)
    const [product,setProduct]=useState()
    const [deleteProductDialog,setDeleteProductDialog]=useState(false)
    useEffect(()=>{
        fetchPhones()
    },[])

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
                }
                const data = await res.json();
                setPhones(data);
    };

    const saveEdit = async(e) => {
        const { newData, index } = e;
        const body = JSON.stringify(newData);
        const res = await fetch("http://127.0.0.1:8000/edit_product/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body,
    });
    if(res.ok){
        fetchPhones();
    }
    };
const tableHeader=(<div className="flex flex-wrap align-items-center justify-content-between gap-2">
    <span className="text-xl text-900 font-bold">Products</span> <Button label="Add Product" icon="pi pi-plus" onClick={() => setAddVisible(true)}/>
</div>)

const phoneImg = (phone) => {
    return <img src={`http://127.0.0.1:8000${phone.img}`}  className='w-5rem shadow-2 border-round'/>;
};
const tableFooter = `In total there are ${phones ? phones.length : 0} products.`;

const updatePdt=()=>{
    setAddVisible(false)
    fetchPhones()
}
const deleteProduct = async () => {
    const itemID=product.id
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
        setDeleteProductDialog(false)
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Can't delete the product at this moment.",
        });
        setDeleteProductDialog(false)
    }
};

const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
        </React.Fragment>
    );
};

const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
};

const deleteProductDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={()=>setDeleteProductDialog(false)} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
);
const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '100px'  }}/>;
};
const descEditor = (options) => {
    return <InputTextarea type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '350px'  }}/>;
};
const priceEditor = (options) => {
    return <InputText type='number' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '100px'  }} />;
};




    
  return (
    <div className='container'>
      <div className="card">
            <DataTable editMode="row" sortField='id' onRowEditComplete={saveEdit} sortOrder={-1} value={phones} showGridlines header={tableHeader} footer={tableFooter} tableStyle={{ minWidth: '60rem' }}>
                <Column field='id' header='Id' sortable></Column>
                <Column field="name" header="Name" style={{maxWidth:'7rem'}} editor={(options) => textEditor(options)}></Column>
                <Column header="Image" body={phoneImg}></Column>
                <Column field="price" header="Price"  editor={(options) => priceEditor(options)} sortable></Column>
                <Column field="desc" header="Description" 
                    body={(rowData) => (
                        rowData.desc.split("\n").map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        )))}
                    editor={(options) => descEditor(options)} ></Column> 
                <Column rowEditor={true}  ></Column>
                <Column body={actionBodyTemplate}  style={{ minWidth: '3rem' }}></Column>
            </DataTable>
        </div>
        <Dialog header="Add Product" visible={addVisible} onHide={()=>setAddVisible(false)}>
            <AddProduct onClose={updatePdt}/>
        </Dialog>

        <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} footer={deleteProductDialogFooter} header="Confirm" modal  onHide={()=>setDeleteProductDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
        </Dialog>
    </div>
  )
}

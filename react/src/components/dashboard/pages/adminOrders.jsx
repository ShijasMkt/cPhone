import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState ,useRef} from 'react';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
        

        

export default function AdminOrders() {
  const [orders,setOrders]=useState()
  const [totalSales,setTotalSales]=useState(0)
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [orderView,setOrderView]=useState(false)

  const dt = useRef(null);

  useEffect(()=>{
    fetchOrders()
  },[])


  useEffect(() => {
    if (orders) {
      const total = orders.reduce((acc, order) => acc + order.price, 0);
      setTotalSales(total);
      
    }
  }, [orders]);
  

  const fetchOrders=async()=>{
    const userID=0;
    const body = JSON.stringify({ userID });
    const res = await fetch("http://127.0.0.1:8000/fetch_orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if(res.ok){
      const data = await res.json();
      setOrders(data);
    }
  }

  
  
  
   

  const exportCSV = (selectionOnly) => {
      dt.current.exportCSV({ selectionOnly });
  };

    
 
  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };
  const priceBodyTemplate = (order) => {
    return formatCurrency(order.price);
  };
  
const itemImg = (order) => {
  return <img src={`http://127.0.0.1:8000${order.item.img}`}  className='w-5rem shadow-2 border-round'/>;
};
  const tableHeader=(<div className="flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="text-xl text-900 font-bold">Orders</span> 
          <span>
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
          </span>
      </div>)

const tableFooter = (
  <div className='d-flex justify-content-between'>
    <div>
    In total there are {orders ? orders.length : 0} Orders.
  </div>
  <div>
    Total Sales: <span className='text-success'>{formatCurrency(totalSales)}</span> 
  </div>
  </div>
  
)

const statusBodyTemplate = (rowData) => {
  const status = rowData.status || "Shipped"; 
  return (
    <Tag 
      value={status} 
      severity={getSeverity(status)} 
    />
  );
};

const getSeverity = (status) => {
  switch (status) {
      case 'Delivered':
          return 'success';

      case 'Shipped':
          return 'warning';

      default:
          return null;
  }
};
const onRowSelect = () => {
  setOrderView(true)
};

const onRowUnselect = () => {
  setOrderView(false)
  setSelectedOrder([])
};

const downloadInvoice=async()=>{
  try {
      const response = await fetch(`http://127.0.0.1:8000/invoice/${selectedOrder.orderID}/`, {
          method: "GET",
          headers: {
    "Content-Type": "application/pdf",
  },
      });
      
      const invoiceID=100+parseInt(selectedOrder.orderID)
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Invoice_${invoiceID}.pdf`; 
      document.body.appendChild(a);

      a.click(); 

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

      if (!response.ok) {
          throw new Error('Error fetching invoice');
      }

      
  } catch (error) {
      console.error('Error downloading invoice:', error);
  }
}


  return (
    <div className='container'>
      <div className='card'>
      <DataTable  ref={dt} value={orders}  selectionMode={'single'} selection={selectedOrder} onSelectionChange={(e) => {setSelectedOrder(e.value);}} 
        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}  tableStyle={{ minWidth: '50rem'}} showGridlines header={tableHeader} footer={tableFooter} >
                      <Column field="orderID" sortable header="#"></Column>
                      <Column field="item.name" header="Item"></Column>
                      <Column field='date' sortable header="Date"></Column>
                      <Column field='qty' header="Qty"></Column>
                      <Column header="Status" body={statusBodyTemplate} sortable ></Column>
                      <Column header="Image" body={itemImg} align={"center"}></Column>
                      <Column field='price' header="Total Amount" body={priceBodyTemplate} align={"right"}></Column>
      </DataTable>
      <Dialog header={`Order #${selectedOrder.orderID}`} visible={orderView} style={{ width: '50vw' }} onHide={onRowUnselect}>
               <div className="container">
                {selectedOrder.address?<>
                  <div className="row">
                  <div className="col-6">
                    <div className="card p-3  align-items-center text-center">
                    <img 
                            src={`http://127.0.0.1:8000${selectedOrder.item.img}`}
                            alt=""
                            width={100}
                        />
                        <div className='order-item-details '>
                            {selectedOrder.item.name}
                            <span>{selectedOrder.item.desc.split('\n')[0]}</span>
                            <h5 className='mt-5'>₹{selectedOrder.price}</h5>
                        </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card p-3">
                    <h5 className='mb-3'>Delivery Address</h5>
                            <div>{selectedOrder.address.fname} {selectedOrder.address.lname}</div>
                            <div>{selectedOrder.address.address}-{selectedOrder.address.pincode}</div>
                            <div>Phone number: {selectedOrder.address.mobile}</div>
                    </div>
                    <div className="card mt-3 p-3">
                    <div className='order-delivery-status'>
                            <div className='delivery-status-elements'>Delivery Status: <span style={{color: selectedOrder.status==="Shipped"?"orange":"green"}}>{selectedOrder.status}</span></div>
                            <div className='delivery-status-elements mt-2'>Download Invoice: <button type="button" className="download-btn" onClick={downloadInvoice}>Download</button></div>
                        </div>
                    </div>
                  </div>
                 
                  
                </div>
                
                
                </>:<>
                </>}
                
               </div>
      </Dialog>
      </div>
    </div>
  )
}

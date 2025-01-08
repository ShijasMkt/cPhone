
from django.http import HttpResponse
from django.shortcuts import render
from app1.models import *
from .serializers import *
from django.template.loader import render_to_string
from weasyprint import HTML
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])


def generate_invoice(request,order_id):
    
    try:
        # Fetch order details
        order_details = Orders.objects.select_related('address', 'item').get(id=order_id)
        address_serializer = AddressDataSerializer(order_details.address)
        item_serializer = PhoneDataSerializer(order_details.item)
        invoice_id = 100 + order_id

        # Prepare invoice data
        invoice_data = {
            "date": order_details.date,
            "qty": order_details.qty,
            "price": order_details.total_price,
            "address": address_serializer.data,
            "item": item_serializer.data,
            "orderID": order_id,
            "invoiceID": invoice_id
        }
       
        # Render HTML template for PDF
        html_string = render_to_string('invoice.html', invoice_data)
        html = HTML(string=html_string)

        # Generate PDF content
        pdf_content = html.write_pdf()
        
        if not pdf_content:
            return HttpResponse("Error generating PDF", status=500)

        # Set headers for file download
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice_id}.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response['invoice-id']=invoice_id


        return response

    except Exception as e:
        return HttpResponse(f"Error generating PDF: {e}", status=500)
    
   

from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response
from app1.models import user
from app1.models import Phones
from app1.models import Cart
from app1.models import Address
from .tools.send_email import send_email
from .tools.otp import generate_otp
from .tools.generate_invoice import generate_invoice

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import string
import random
from .tools.serializers import *
from django.contrib.auth.hashers import make_password,check_password



def randomKey():
    

    res = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=11))
    return res






@api_view(['POST'])
@permission_classes([AllowAny])
def checkLogin(request):
    if request.method== 'POST':
        data = request.data
        email = data.get('email')
        raw_password = data.get('password')
        try:
            user_data = user.objects.get(email=email)
            user_id=user_data.id
            user_name=user_data.name
            hashed_password = user_data.password
            check=check_password(raw_password,hashed_password)
            
        
            if check:
                user_key=randomKey()
                return Response({'user_key':user_key,'user_id':user_id,'user_name':user_name},status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except user.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)    
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method=='POST':
        data=request.data
        name=data.get('uName')
        email=data.get('email')
        password=data.get('password')
        password  = make_password(password)
        
        if user.objects.filter(email=email).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            user_data=user()
            user_data.name=name
            user_data.email=email
            user_data.password=password
            user_data.save()
            return Response(status=status.HTTP_200_OK)
        
@api_view(['GET'])
@permission_classes([AllowAny])
def phonesList(request):
    if request.method=='GET':
        phone_data=Phones.objects.all()
        serializer = PhoneDataSerializer(phone_data, many=True)
        return Response(data=serializer.data,status=status.HTTP_200_OK)
    
@api_view(['POST'])    
@permission_classes([AllowAny])
def addItemsToCart(request):
    if request.method=='POST':
        
        
        data=request.data
        user_id=data.get('userID')
        item_id=data.get('itemID')
        date=data.get('date')
        myItems=Phones.objects.get(id=item_id)
        product_id=myItems.id
        price=myItems.price
        cart_item = Cart.objects.filter(user_id=user_id, product_id=item_id).first()
        if cart_item:
            cart_item.qty+=1
            cart_item.date=date
            cart_item.save()

        else:    
            new_cart_item=Cart(
                user_id_id=user_id,
                product_id=product_id,
                price=price,
                date=date,
                qty=1
            )
            new_cart_item.save()

        return Response(status=status.HTTP_200_OK)        

        
@api_view(['POST'])
@permission_classes([AllowAny])        
def showCart(request):
    if request.method=='POST':
        user_id=request.data.get('userID')
        cart_items = Cart.objects.filter(user_id=user_id)
        products = [
        {
        'product': cart_item.product,  
        'qty': cart_item.qty  
        }
        for cart_item in cart_items
        ]
        total_price=0
        total_price = sum(cart_item.product.price * cart_item.qty for cart_item in cart_items)
        serializer = PhoneDataSerializer([entry['product'] for entry in products], many=True)
        return Response(data={'products': serializer.data,'quantities': [item['qty'] for item in products], 'total_price': total_price,},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def deleteCartItem(request):
    if request.method=='POST':
        user_id=request.data.get('userID')
        option=request.data.get('option')
        if option==1:
            item=request.data.get('itemID')
            cart_item = Cart.objects.filter(user_id=user_id, product_id=item).first()
            if cart_item:
                cart_item.delete()
                return Response(data={'message': 'Item deleted successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(data={'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        else:
            cart_item = Cart.objects.filter(user_id=user_id).all()
            if cart_item:
                cart_item.delete()
                return Response(data={'message': 'Item deleted successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(data={'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        
        
    
@api_view(['POST'])
@permission_classes([AllowAny])

def saveAddress(request):
    if request.method=='POST':
        user_id=request.data.get('userID')
        formData=request.data.get('formData')
        

        new_address=Address(
                user_id_id=user_id,
                fname=formData['fname'],
                lname=formData['lname'],
                mobile=formData['mobile'],
                pincode=formData['pincode'],
                address=formData['address'],
                type=formData['type']
            )
        new_address.save()
        
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])

def editAddress(request):
    if request.method=='POST':
        formData=request.data.get('formData')
        address_id=formData['id']
        address=Address.objects.get(id=address_id)
        if address:
            address.fname=formData['fname']
            address.lname=formData['lname']
            address.mobile=formData['mobile']
            address.pincode=formData['pincode']
            address.address=formData['address']
            address.type=formData['type']
            address.save()
            return Response(status=status.HTTP_200_OK) 

        
    
@api_view(['POST'])
@permission_classes([AllowAny])
def showAddress(request):
    if request.method == 'POST':
        user_id = request.data.get('userID')
        
        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_address = Address.objects.filter(user_id=user_id, deleted=False)
            if not user_address.exists():
                return Response({"message": "No addresses found for the given user."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = AddressDataSerializer(user_address, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        

@api_view(['POST'])
@permission_classes([AllowAny])
def deleteAddress(request):
    if request.method=='POST':
        user_id=request.data.get('userID')
        address_id=request.data.get('addressID')
        address=Address.objects.get(user_id=user_id,id=address_id)
        
        if address:
            address.deleted=True
            address.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
@permission_classes([AllowAny])        
def resetEmail(request):
     if request.method=='POST':
         email=request.data.get('email')
         otp=generate_otp()
         send_email(email,otp)
         return Response(data={'otp':otp},status=status.HTTP_200_OK)
     
@api_view(['POST'])
@permission_classes([AllowAny])      
def checkUser(request):
    if request.method=='POST':
        email=request.data.get('email')
        user_found = user.objects.get(email=email)
        if user_found:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
@permission_classes([AllowAny])          
def resetPass(request):
    if request.method=='POST':
        email=request.data.get('email')
        password=request.data.get('password')
        selected_user=user.objects.get(email=email)
        password  = make_password(password)
        selected_user.password=password
        selected_user.save()
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])    
@permission_classes([AllowAny])
def addToWishlist(request):
    if request.method=='POST':
        data=request.data
        user_id=data.get('userID')
        item_id=data.get('itemID')
        item=WishList.objects.filter(user_id_id=user_id,item_id=item_id)
        if(item):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            wish_item=WishList(user_id_id=user_id,item_id=item_id)
            wish_item.save()
            return Response(status=status.HTTP_200_OK)    

@api_view(['POST'])    
@permission_classes([AllowAny])
def showWishlist(request):
    if request.method=='POST':
        data=request.data
        user_id=data.get('userID')
        wish_items = WishList.objects.filter(user_id=user_id)
        products = [wish_item.item for wish_item in wish_items]
    
        serializer = PhoneDataSerializer(products, many=True)
        return Response(data={'products': serializer.data},status=status.HTTP_200_OK)
      
@api_view(['POST'])    
@permission_classes([AllowAny])
def deleteWishlistItem(request):
    if request.method=='POST':
        data=request.data
        user_id=data.get('userID')
        item_id=data.get('itemID')
        wish_item=WishList.objects.filter(user_id=user_id,item_id=item_id).first()
        wish_item.delete()
        return(Response(status=status.HTTP_200_OK))   

@api_view(['POST'])    
@permission_classes([AllowAny])
def userDetails(request):
    if request.method=='POST':
        data=request.data
        user_id=data.get('userID')
        user_data=user.objects.get(id=user_id)
        
        serializer=UserDataSerializer(user_data)
        return(Response(data={'userData':serializer.data},status=status.HTTP_200_OK))    
     
@api_view(['POST'])
@permission_classes([AllowAny])
def editUserDetails(request):
    if request.method == 'POST':
        data = request.data
        user_id = data.get('userID')
        option_selected = data.get('option')
        user_instance = user.objects.filter(id=user_id).first()
        if option_selected == 'name':
            user_name = data.get('name')
            user_instance.name = user_name
            user_instance.save()
            return Response(status=status.HTTP_200_OK)
        else:
            img = request.FILES.get('user_img')
            if img:
                user_instance.user_img = img
                user_instance.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response({"error": "Image not provided"}, status=status.HTTP_400_BAD_REQUEST)
                                 
@api_view(['POST'])    
@permission_classes([AllowAny])
def deleteUserAccount(request):
    if request.method=='POST':
        data=request.data
        user_id=data.get('userID')
        user_data=user.objects.get(id=user_id)
        if user_data:
            user_data.deleted=True
            user_data.save()
            return(Response(status=status.HTTP_200_OK))
        
    

@api_view(['POST'])    
@permission_classes([AllowAny])
def placeOrder(request):
    if request.method=='POST':
            data=request.data
            userID=data.get('userID')
            itemID=data.get("itemID")
            date=data.get("date")
            total_price=data.get("totalPrice")
            qty=data.get("qty")
            addressID=data.get("addressID")
            paymentMode=data.get("paymentMode")
            paymentID=data.get("paymentID")

            if paymentMode=="cod":
                new_order=Orders(
                    user_id_id=userID,
                    item_id=itemID,
                    date=date,
                    total_price=total_price,
                    qty=qty,
                    address_id=addressID,
                    payment_mode=paymentMode,
                )

                new_order.save()
        
            return(Response(status=status.HTTP_200_OK))    


@api_view(['POST'])    
@permission_classes([AllowAny])
def fetchOrders(request):
    if request.method=='POST':
        data=request.data
        userID=data.get('userID')

        if userID==0:
            order_details = Orders.objects.select_related('address', 'item').all()
        else:    
            order_details = Orders.objects.select_related('address', 'item').filter(user_id_id=userID)
        all_orders = []
                
        if not order_details:
                return Response({"error": "No order found for the given user."}, status=status.HTTP_404_NOT_FOUND)
        for order in order_details:
            order.update_status()
            address_serializer = AddressDataSerializer(order.address)
            item_serializer = PhoneDataSerializer(order.item)

            response_data = {
            "date": order.date,
            "qty": order.qty,
            "price": order.total_price,
            "address": address_serializer.data,
            "item": item_serializer.data,
            "orderID":order.id,
            "status":order.status
            }
            all_orders.append(response_data)

        return Response(all_orders, status=status.HTTP_200_OK)
    


@api_view(['POST'])
@permission_classes([AllowAny])
def manageInvoice(request):
    if request.method == 'POST':
        data = request.data
        orderID = data.get('orderID')

        if orderID:
            res =  generate_invoice(orderID)
            print(res)
            res = {'res':res}
            return HttpResponse(res)
        else:
            return HttpResponse("Order ID not provided", status=400)

##dasboard###########################################################################
@api_view(['GET'])
@permission_classes([AllowAny]) 
def overView(request):
    if request.method=='GET':
        order_count=Orders.objects.all().count() 
        revenue = sum(order['total_price'] for order in Orders.objects.values('total_price')) or 0
        user_count=user.objects.filter(deleted=False).count() 
        product_count=Phones.objects.all().count() 
        return_data={
            'orderCount':order_count,
            'userCount':user_count,
            'totalRevenue':revenue,
            'productCount':product_count
        }
        
        return Response(status=status.HTTP_200_OK,data=return_data)


@api_view(['POST'])
@permission_classes([AllowAny])        
def addProduct(request):
    if request.method=='POST':
        name=request.data.get('name')
        price=request.data.get('price')
        desc=request.data.get('desc')
        img=request.FILES.get('img')

        phone=Phones(
            name=name,
            price=price,
            desc=desc,
            img=img
        )

        phone.save()

        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])        
def deleteProduct(request):
    if request.method=='POST':
        item_id=request.data.get('itemID')       
        item=Phones.objects.filter(id=item_id)
        if item:
            item.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
@permission_classes([AllowAny])        
def editProduct(request):
    if request.method=='POST':
        item_id=request.data.get('id')
        new_data=request.data
        new_name=new_data.get('name')
        new_price=new_data.get('price')
        new_desc=new_data.get('desc')
        item=Phones.objects.get(id=item_id)
        if item:
            item.name=new_name
            if new_price!='':
                item.price=new_price
            item.desc=new_desc
            item.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny]) 
def fetchUsers(request):
    if request.method=='GET':
        user_details=user.objects.filter(deleted=False)
        users_data=UserDataSerializer(user_details,many=True)
        return Response(status=status.HTTP_200_OK,data=users_data.data)

       

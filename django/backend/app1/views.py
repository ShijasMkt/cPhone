from django.shortcuts import render
from rest_framework.response import Response
from app1.models import user
from app1.models import Phones
from app1.models import Cart
from app1.models import Address
from .tools.send_email import send_email
from .tools.otp import generate_otp

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
                fname=formData['fName'],
                lname=formData['lName'],
                mobile=formData['mobile'],
                pincode=formData['pincode'],
                address=formData['address'],
                type=formData['type']
            )
        new_address.save()
        
        return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def showAddress(request):
        if request.method=='POST':
            user_id=request.data.get('userID')
            user_address=Address.objects.filter(user_id=user_id).all()
            serializer = AddressDataSerializer(user_address, many=True)
        return Response(data=serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def deleteAddress(request):
    if request.method=='POST':
        user_id=request.data.get('userID')
        address_id=request.data.get('addressID')
        address=Address.objects.filter(user_id=user_id,id=address_id)
        
        if address:
            address.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

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
        user_data.delete()
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
        
        order_details = Orders.objects.select_related('address', 'item').filter(user_id_id=userID)
        all_orders = []
                
        if not order_details:
                return Response({"error": "No order found for the given user."}, status=status.HTTP_404_NOT_FOUND)
        for order in order_details:
            address_serializer = AddressDataSerializer(order.address)
            item_serializer = PhoneDataSerializer(order.item)

            response_data = {
            "date": order.date,
            "qty": order.qty,
            "price": order.total_price,
            "address": address_serializer.data,
            "item": item_serializer.data,
            "orderID":order.id,
            }
            all_orders.append(response_data)

        return Response(all_orders, status=status.HTTP_200_OK)

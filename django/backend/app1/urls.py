from django.urls import path
from .views import *

urlpatterns = [
    # path('api/',home),
    path('login/',checkLogin),
    path('register/',register),
    path('phones/',phonesList),
    path('add_cart/',addItemsToCart),
    path('show_cart/',showCart),
    path('delete_cart_item/',deleteCartItem),
    path('address/',saveAddress),
    path('show_address/',showAddress),
    path('delete_address/',deleteAddress),
    path('add_product/',addProduct),
    path('delete_product/',deleteProduct),
    path('reset_email/',resetEmail),
    path('check_user/',checkUser),
    path('reset_pass/',resetPass)
]
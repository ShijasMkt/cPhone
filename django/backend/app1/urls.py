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
    path('edit_address/',editAddress),
    path('delete_address/',deleteAddress),
    path('reset_email/',resetEmail),
    path('check_user/',checkUser),
    path('reset_pass/',resetPass),
    path('add_wishlist/',addToWishlist),
    path('show_wishlist/',showWishlist),
    path('delete_wishlist_item/',deleteWishlistItem),
    path('user_details/',userDetails),
    path('user_details_update/',editUserDetails),
    path('delete_account/',deleteUserAccount),
    path('place_order/',placeOrder),
    path('fetch_orders/',fetchOrders),
    # path('invoice/',manageInvoice),
    path('invoice/<int:order_id>/',generate_invoice,name='generate_invoice'),

    ##dashboard
    path('overview/',overView),
    path('add_product/',addProduct),
    path('delete_product/',deleteProduct),
    path('dashboard/users/',fetchUsers),
    path('edit_product/',editProduct)


]
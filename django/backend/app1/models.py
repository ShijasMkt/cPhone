from django.db import models
from django.utils.timezone import now
from datetime import timedelta

# Create your models here.
class user(models.Model):
    name=models.CharField(max_length=30)
    email=models.CharField(max_length=30)
    password=models.CharField(max_length=30)
    user_img=models.ImageField(upload_to='upload/users',blank=True,null=True)
    deleted=models.BooleanField(default=False)

class Phones(models.Model):
    name=models.CharField(max_length=30)
    price=models.FloatField()
    img=models.ImageField(upload_to='upload/phones')
    desc=models.CharField(max_length=500,blank=True,null=True)

class Cart(models.Model):
    user_id=models.ForeignKey(user,on_delete=models.CASCADE)
    product=models.ForeignKey(Phones,on_delete=models.CASCADE)
    qty=models.IntegerField()
    date=models.DateField()
    price=models.FloatField()

    def __str__(self):
        return self.user_id.name

class Address(models.Model):
    user_id=models.ForeignKey(user,on_delete=models.CASCADE)
    fname=models.CharField(max_length=50)
    lname=models.CharField(max_length=50)
    mobile=models.TextField()
    pincode=models.IntegerField()
    address=models.CharField(max_length=200)
    type=models.CharField(max_length=10)
    deleted=models.BooleanField(default=False)

class WishList(models.Model):
    user_id=models.ForeignKey(user,on_delete=models.CASCADE)
    item=models.ForeignKey(Phones,on_delete=models.CASCADE) 

class Orders(models.Model):
    user_id=models.ForeignKey(user,on_delete=models.CASCADE)
    item=models.ForeignKey(Phones,on_delete=models.CASCADE)
    date=models.DateField()
    total_price=models.FloatField()  
    qty=models.IntegerField() 
    address=models.ForeignKey(Address,on_delete=models.CASCADE,blank=True,null=True) 
    payment_mode=models.CharField(max_length=20,blank=True,null=True)
    payment_id=models.IntegerField(blank=True,null=True)
    status=models.CharField(max_length=20,default="Shipped")

    def update_status(self):
        
        if now().date() >= self.date + timedelta(days=3):
            self.status = "Delivered"
            self.save()

        
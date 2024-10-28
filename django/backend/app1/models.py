from django.db import models

# Create your models here.
class user(models.Model):
    name=models.CharField(max_length=30)
    email=models.CharField(max_length=30)
    password=models.CharField(max_length=30)

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
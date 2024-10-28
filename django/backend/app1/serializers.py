
from app1.models import user
from rest_framework import serializers
from app1.models import *



class PhoneDataSerializer(serializers.ModelSerializer):

    class Meta:

        model = Phones

        fields = '__all__'

class AddressDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields='__all__'
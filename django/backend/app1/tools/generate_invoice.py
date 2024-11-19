from app1.models import *
import os

from tempfile import Temp1

from InvoiceGenerator.api import Invoice, Item, Client, Provider, Creator



client = Client('cPhone')
provider = Provider('My company', bank_account='2600420569', bank_code='2010')
creator = Creator('Shijas')

invoice = Invoice(client, provider, creator)
invoice.currency_locale = 'en_US.UTF-8'
invoice.add_item(Item(32, 600, description="Item 1"))
invoice.add_item(Item(60, 50, description="Item 2", tax=21))
invoice.add_item(Item(50, 60, description="Item 3", tax=0))
invoice.add_item(Item(5, 600, description="Item 4", tax=15))

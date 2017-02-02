# -*- coding: utf-8 -*-
from pyspark import SparkContext
from pyspark.sql import *
from pandas.io.json import json_normalize
from geopy.distance import great_circle
import dateutil.parser as date
import uuid
import TwitterRepository


spark = SparkSession\
    .builder\
    .appName("SensorRepository")\
    .getOrCreate()

sc = spark.sparkContext

def createHearthRateSchema(type, data):
    if type == "twitter":
        newData = {}
        newData['id'] = uuid.uuid4()
        newData['created_at'] = date.parse(data['created_at'])
        newData['dayofweek'] = date.parse(data['created_at']).strftime("%A")
        newData['value'] = data['value']
        return newData

# -*- coding: utf-8 -*-
from pyspark.sql import *
from pyspark.sql.types import *
from pyspark import SparkContext
from pandas.io.json import json_normalize
import dateutil.parser as date
import json
import os.path as path
from pprint import pprint

spark = SparkSession\
    .builder\
    .appName("Initial Repository")\
    .getOrCreate()

sc = spark.sparkContext

# for HR_table
if not path.exists("HEARTRATE.parquet"):
    with open('./CreateTable/Heartrate.json') as json_data:
        HRsJSON = json.load(json_data)
        HRschema = []
        for hrValue in HRsJSON['heart_rate']:
            # HRschema.append(hr)
            pprint(hrValue[0])

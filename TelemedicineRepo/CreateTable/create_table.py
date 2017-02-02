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
    with open('Heartrate.json') as json_data:
        HRsJSON = json.load(json_data)
        HRschema = []
        for hr in HRsJSON:
            HRschema.append(hr)
            # pprint(hr)
        # print HRschema
        HRRDD = sc.parallelize(HRschema)
        HRDF = spark.createDataFrame(HRRDD)
        HRDF.printSchema()
        # HRDF.show()
        HRDF.write.parquet("HEARTRATE.parquet")

if not path.exists("RESPIRATION.parquet"):
    with open('Breathrate.json') as json_data:
        BrsJSON = json.load(json_data)
        Brschema = []
        for br in BrsJSON:
            Brschema.append(br)
            # pprint(hr)
        # print HRschema
        BRRDD = sc.parallelize(Brschema)
        BRDF = spark.createDataFrame(BRRDD)
        BRDF.printSchema()
        # HRDF.show()
        BRDF.write.parquet("BREATHRATE.parquet")

# -*- coding: utf-8 -*-
from pyspark import SparkContext
from pyspark.sql import *
from pandas.io.json import json_normalize
from geopy.distance import great_circle
import dateutil.parser as date
from controllers import mylib
import json
spark = SparkSession\
    .builder\
    .appName("SensorRepository")\
    .getOrCreate()

sc = spark.sparkContext
sqlCtx = SQLContext(sc)

#2016-11-10T16:10:00+07:00

# save HR data to HR table
def saveHR(heartrate):
    heartrateParquet = "CreateTable/HEARTRATE.parquet"
    #read parquet
    heartrateDF = spark.read.parquet(heartrateParquet)
    HRArr = []
    for hr in heartrate:
        # in the same time can't keep 2 value of hr of same uid
        checkEx = heartrateDF.where((heartrateDF.uid == hr['uid']) & (heartrateDF.date_time == hr['date_time']))
        # print hr
        if checkEx.count()==0:
            # add this value to table column
            # print hr
            HRArr.append(hr)
            # print "We've already had this data set." # will upgrade  to be something lately.
    if len(HRArr) != 0:
        HRRDD = sc.parallelize(HRArr)
        HRDF = spark.createDataFrame(HRRDD)
        HRDF.write.mode("append").parquet(heartrateParquet)
    #save Raw hr data
    return HRArr #for saving to ]

def showHRTable():
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    # sqlDF = spark.sql("SELECT * FROM queryBaseDF")
    queryBaseDF.show()
    return "Show in terminal"

def hrLatest(id_):
    # print type(id_);
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    queryBaseDF.createOrReplaceTempView("heartrate")
    try :
        hr = spark.sql("SELECT * FROM heartrate WHERE date_time = (SELECT MAX(date_time) FROM heartrate WHERE uid == 1)")
    except :
        return "No data in table"
    date_time = hr.rdd.map(lambda p: p.date_time).collect()
    value = hr.rdd.map(lambda x: int(x.value)).collect()
    data = {}
    data['heart_rate'] = {'value' : value[0], 'unit' : "beats/min" }
    data['effective_time_frame'] = ({'date_time' : mylib.toUTCTime(date_time[0])})
    return json.dumps(data)


def hrbyId(id_):
    # print type(id_);
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    queryBaseDF.createOrReplaceTempView("heartrate")
    try :
        hr = spark.sql("SELECT * FROM heartrate WHERE uid == " + id_)
    except :
        return "No data in table"
    date_timeList = hr.rdd.map(lambda p: p.date_time).collect()
    valueList = hr.rdd.map(lambda x: int(x.value)).collect()
    data_list = []
    data = {}
    for n in range(len(valueList)):
        data['heart_rate'] = {'value' : valueList[n], 'unit' : "beats/min" }
        data['effective_time_frame'] = ({'date_time' : mylib.toUTCTime(date_timeList[n])})
        data_list.append(json.dumps(data))
    return json.dumps(data_list)
        # hr.show()
        # jsobj["a"]["b"]["e"].append({"f":var3, "g":var4, "h":var5})

def hrbyidtime(id_, time_):
    # print id_
    # print time_
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    queryBaseDF.createOrReplaceTempView("heartrate")
    # print "SELECT * FROM heartrate WHERE uid == " + id_ +" AND date_time == " + time_
    try:
        hr = spark.sql("SELECT * FROM heartrate WHERE uid == " + id_ +" AND date_time == " + time_)
    except:
        return "No data in table"
    date_timeList = hr.rdd.map(lambda p: p.date_time).collect()
    valueList = hr.rdd.map(lambda x: int(x.value)).collect()
    data_list = []
    data = {}
    for n in range(len(valueList)):
        data['heart_rate'] = {'value' : valueList[n], 'unit' : "beats/min" }
        data['effective_time_frame'] = ({'date_time' : mylib.toUTCTime(date_timeList[n])})
        data_list.append(json.dumps(data))
    return json.dumps(data_list)

def hrbyPeriod(id_, start, end):
    # print id_
    # print time_
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    queryBaseDF.createOrReplaceTempView("heartrate")
    # print "SELECT * FROM heartrate WHERE uid == " + id_ +" AND date_time == " + time_
    try:
        hr = spark.sql("SELECT * FROM heartrate WHERE uid == " + id_ +" AND date_time >= " + start + " AND date_time <= " + end)
        date_timeList = hr.rdd.map(lambda p: p.date_time).collect()
        valueList = hr.rdd.map(lambda x: int(x.value)).collect()

        data_list = []
        data = {}
        for n in range(len(valueList)):
            data['heart_rate'] = {'value' : valueList[n], 'unit' : "beats/min" }
            data['effective_time_frame'] = ({'date_time' : mylib.toUTCTime(date_timeList[n])})
            data_list.append(json.dumps(data))
        return json.dumps(data_list)
    except:
        return "No data in table"

# -*- coding: utf-8 -*-
from pyspark import SparkContext
from pyspark.sql import *
from pandas.io.json import json_normalize
from geopy.distance import great_circle
import dateutil.parser as date
import uuid
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
    # print "what the fuck"
    # print heartrate
    heartrateDF = spark.read.parquet(heartrateParquet)
    count = 0
    HRArr = []
    for hr in heartrate:
        # in the same time can't keep 2 value of hr of same uid
        checkEx = heartrateDF.where(heartrateDF.uid == hr['uid'])
        checkEx2 = heartrateDF.where(heartrateDF.date_time == hr['date_time'])
        print hr
        if checkEx.count()==0 or checkEx2.count()==0:
            # add this value to table column
            # print hr
            HRArr.append(hr)
            count = count+1
            if count == 100:
                HRRDD = sc.parallelize(HRArr)
                HRDF = spark.createDataFrame(HRRDD)
                HRDF.write.mode("append").parquet(heartrateParquet)
                HRArr = []
                count = 0
        else:
            print "We've already had this data set." # will upgrade  to be something lately.
    HRRDD = sc.parallelize(HRArr)
    HRDF = spark.createDataFrame(HRRDD)
    HRDF.write.mode("append").parquet(heartrateParquet)
    #save Raw hr data
    return HRArr #for saving to ]

def selectHRCol(heartrate, queryId):
    newHR = {}
    newHR['uid'] = heartrate['uid']

    newHR['value'] = heartrate['activities-heart-intraday']['dataset']['value']
    # create date_time
    date = heartrate['dateTime']
    time = heartrateheartrate['activities-heart-intraday']['dataset']['time']
    date_time = date + "T" + time + "+07:00"
    newHR['date_time'] = date_time
    return newHR

def showHRTable():
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    # sqlDF = spark.sql("SELECT * FROM queryBaseDF")
    queryBaseDF.show()
    # return queryBaseDF

def hrbyId(id_):
    print id_
    queryParquet = "CreateTable/HEARTRATE.parquet"
    queryBaseDF = spark.read.parquet(queryParquet)
    queryBaseDF.createOrReplaceTempView("heartrate")
    hr = spark.sql("SELECT * FROM heartrate WHERE uid == " + id_)
    hr.show()
    date_timeList = hr.rdd.map(lambda p: p.date_time).collect()
    valueList = hr.rdd.map(lambda x: int(x.value)).collect()
    uidList = hr.rdd.map(lambda x: int(x.uid)).collect()
    data = {}
    data_list = []
    for n in range(len(valueList)):
        data['value'] = valueList[n]
        data['date_time'] = date_timeList[n]
        data['uid'] = uidList[n]
        data_list.append(json.dumps(data))
    return json.dumps(data_list)
    # date_timeList = hr.rdd.map(lambda p: "date_time: " + p.date_time).collect()
    # return hrList
# def saveTweetQuery(tweetQuery):
#     tweetQueriesParquet = "tweetQuery.parquet"
#     tweetQueryBaseDF = spark.read.parquet(tweetQueriesParquet)
#     existTweetQuery = tweetQueryBaseDF.where(tweetQueryBaseDF.)
#     if existTweetQuery.count() == 0:
#         tweetQueryRDD = sc.parallelize([tweetQuery])
#         tweetQueryDF = spark.read.json(tweetQueryRDD)
#         tweetQueryDF.show()

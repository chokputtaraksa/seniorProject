from pyspark import SparkContext
from pyspark.sql import SparkSession
from pyspark.sql import Row

spark = SparkSession\
    .builder\
    .appName("HrTester")\
    .getOrCreate()

sc = spark.sparkContext

# queryParquet = "../CreateTable/HEARTRATE.parquet"
# queryBaseDF = spark.read.parquet(queryParquet)
# queryBaseDF.show()
#
# queryParquet2 = "../CreateTable/BREATHRATE.parquet"
# queryBaseDF2 = spark.read.parquet(queryParquet2)
# queryBaseDF2.show()

queryParquet = "../CreateTable/HEARTRATE.parquet"
queryBaseDF = spark.read.parquet(queryParquet)
queryBaseDF.createOrReplaceTempView("heartrate")
# print ("SELECT * FROM heartrate WHERE date_time = (SELECT MAX(date_time) FROM heartrate WHERE uid == 1)")
try :
    # hr = spark.sql("SELECT * FROM heartrate WHERE uid == 1")
    # hr = spark.sql("SELECT MAX(date_time) FROM heartrate WHERE uid == 1")
    hr = spark.sql("SELECT * FROM heartrate WHERE date_time = (SELECT MAX(date_time) FROM heartrate WHERE uid == 1)")
    hr.show()
except :
    print "No data in table"

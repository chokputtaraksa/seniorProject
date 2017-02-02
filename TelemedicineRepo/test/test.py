from pyspark import SparkContext
from pyspark.sql import SparkSession
from pyspark.sql import Row

spark = SparkSession\
    .builder\
    .appName("HrTester")\
    .getOrCreate()

sc = spark.sparkContext

queryParquet = "../CreateTable/HEARTRATE.parquet"
queryBaseDF = spark.read.parquet(queryParquet)
queryBaseDF.show()

queryParquet2 = "../CreateTable/BREATHRATE.parquet"
queryBaseDF2 = spark.read.parquet(queryParquet2)
queryBaseDF2.show()

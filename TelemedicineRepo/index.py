# -*- coding: utf-8 -*-
from repository import SensorDataRepository
from flask import Flask, request, render_template
import json


app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/")
def index():
    return "Welcome to our Repository!"

# @app.route("/saveBR", methods=['POST'])
# def saveQuery():
#     # print request.get_json()
#     SensorDataRepository.saveHR(request.get_json())
#     return ('Its complete')

@app.route("/saveHR", methods=['POST'])
def saveQuery():
    # print request.get_json()
    SensorDataRepository.saveHR(request.get_json())
    return ('Its complete')

@app.route("/showHrTable", methods=['GET'])
def hrTable():
    df = SensorDataRepository.showHRTable()
    return ("Show in terminal")

@app.route("/hrbyId/<id_>", methods=['GET'])
def getHRbyId(id_=None):
    jsonString = SensorDataRepository.hrbyId(id_)
    return (jsonString)

@app.route("/gethr/id/<id_>/time/<time_>", methods=['GET'])
def getHrbytime(id_=None, time_ = None):
    jsonString = SensorDataRepository.hrbyidtime(id_, time_)
    return (jsonString)

@app.route("/hrbyPeriod/id/<id_>/start/<time_start>/end/<time_end>", methods=['GET'])
def getHrbyPeriod(id_=None, time_start=None, time_end=None):
    jsonString = SensorDataRepository.hrbyPeriod(id_, time_start, time_end)
    return (jsonString)

if __name__ == "__main__":
    app.run(host='0.0.0.0')

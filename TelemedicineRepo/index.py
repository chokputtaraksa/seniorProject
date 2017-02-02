# -*- coding: utf-8 -*-
from repository import HeartRateRepository
from flask import Flask, request, render_template
import json


app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/")
def index():
    return "Welcome to our Repository!"

@app.route("/saveHR", methods=['POST'])
def saveQuery():
    # print request.get_json()
    HeartRateRepository.saveHR(request.get_json())
    return ('Its complete')

@app.route("/showHrTable", methods=['GET'])
def hrTable():
    df = HeartRateRepository.showHRTable()
    return ("Show in terminal")

@app.route("/hrbyId/<id_>", methods=['GET'])
def readHR(id_=None):
    jsonString = HeartRateRepository.hrbyId(id_)
    return (jsonString)
# @app.route("/twitter/saveTweet", methods=['POST'])
# def saveTweet():
#     SocialDataRepository.saveTweet(json.loads(request.get_data()))
#     return ('', 204)
#
# @app.route("/twitter/read", methods=['GET'])
# def readTweet():
#     TwitterRepository.readTweet()
#     return ('', 204)

if __name__ == "__main__":
    app.run(host='0.0.0.0')

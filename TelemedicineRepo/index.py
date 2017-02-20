# -*- coding: utf-8 -*-
from repository import SensorDataRepository
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin
import json
# from flask_socketio import SocketIO

# sio = socketio.Server()
app = Flask(__name__)
app.config['DEBUG'] = True
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app)
CORS(app)


@app.route('/')
def index():
    # """Serve the client-side application."""
    return "Hello World!"

# @app.route("/saveBR", methods=['POST'])
# def saveQuery():
#     # print request.get_json()
#     SensorDataRepository.saveHR(request.get_json())
#     return ('Its complete')

@app.route("/saveHR", methods=['POST'])
def saveQuery():
    # print request.get_json()
    SensorDataRepository.saveHR(request.get_json())
    return ("{'error':'false', 'status':'200'}")

@app.route("/showHrTable", methods=['GET'])
def hrTable():
    df = SensorDataRepository.showHRTable()
    return ("Show in terminal")

@app.route("/hrLatest/<id_>", methods=['GET'])
def getHRLatest(id_=None):
    jsonString = SensorDataRepository.hrLatest(id_)
    return (jsonString)

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

# @sio.on('connect', namespace='/chat')
# def connect(sid, environ):
#     print("connect ", sid)
#
# @sio.on('chat message', namespace='/chat')
# def message(sid, data):
#     print("message ", data)
#     sio.emit('reply', room=sid)
#
# @sio.on('disconnect', namespace='/chat')
# def disconnect(sid):
#     print('disconnect ', sid)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
    # app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    # eventlet.wsgi.server(eventlet.listen(('', 8000)), app)

var heartrate = require('../models/heartrate.js');
    breathrate = require('../models/breathrate.js');
    bodyparser = require("body-parser");
    mylib = require('./mylib');


exports.normalizeFitbitHR = function(jsonData,userID){
  //console.log(jsonData);
  var HRList = [];
  // var date = hrs['activities-heart']['dateTime'];
  // console.log(date);
  var hrs = [];
  var now = new Date();
  var date = now.toISOString().substr(0, 10);
  // console.log(jsonData);
  try{
    hrs = (jsonData['activities-heart-intraday']['dataset']);
    //console.log(hrs[0]['time']);

    for(var i=0; i < hrs.length; i++){
      //console.log("HR = " + hrs[i]['value']);
      var time = hrs[i]['time'];
      var date_time = date + "T" + time + "+07:00"
      var hrValue = hrs[i]['value'];
      // console.log("Time : " +date_time + " Value : " + hrValue);
      var hr = new heartrate(userID, hrValue, "Fitbit", date_time);
      // console.log(hr);
      HRList.push(hr);
      // HRList.push(hrs[i]['value']);
    }
  }catch(error){
    console.log(error);
  }

  // var jsonString = JSON.stringify(HRList);
  return HRList;
}

exports.normalizeHexoHR = function(jsonData,userID){
  var hrList = [];
  var hr = []; //temporary
  try{
    hrs = jsonData['data']['19'];
    for(index in hrs){
      if(hrs[index][1] != null){
        var date_time = mylib.HSTStoUTC(hrs[index][0]);
        var hrValue = hrs[index][1];
        var hr = new heartrate(userID, hrValue, "Hexoskin", date_time);
        hrList.push(hr);
      }
    }
  }catch(error){
    return error;
  }
  // var jsonString = JSON.stringify(hrList);
  return hrList;
}

exports.normalizeHexoBR = function(jsonData, userID){
  var brList = [];
  var br = [];
  try{
    brs = jsonData['data']['33'];
    for(index in brs){
      var date_time = mylib.HSTStoUTC(brs[index][0]);
      var brValue = brs[index][1];
      var br = new heartrate(userID, brValue, date_time);
      brList.push(br);
    }
  }catch(error){
    return error;
  }
  return brList;
}

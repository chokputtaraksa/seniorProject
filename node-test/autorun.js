var fs = require('fs');
    bodyParser = require('body-parser');
    request = require('request');
    mylib = require('./controllers/mylib');
    systems = './systems/userToken.json';
    normalizeData = require('./controllers/normalizeData');
    FitbitApiClient = require("fitbit-node"),
    setInterval(function(){
      content = fs.readFileSync(systems);
      jsonContent = JSON.parse(content);
      content = fs.readFileSync('./systems/userTokenfb.json');
      fitbitContent = JSON.parse(content);
    },4500);
    // console.log(jsonContent);
// // still error
//
var client_id = "227ZYG";
    secret_id = "8df3c4865e35901f964c090f99213bcf"
    client = new FitbitApiClient(client_id, secret_id);
setInterval(function() {// do something every period(24 secs)
  // console.log("Query!!");
  var delayTime = 10;
  var now = new Date();
  var date = now.toISOString().substr(0, 10);
  // get time
  var toHour = now.getHours();
  // if(toHour<10) toHour = "0"+toHour;
  var toMinute = now.getMinutes();
    // if(toMinute<10) toMinute = "0"+toMinute;
  var fromTime = getFromTime(toMinute, toHour, delayTime);
  // console.log("Old" + toHour + ":" + toMinute);
  // console.log("New" + fromTime);
  // jsonReq Example: /activities/heart/date/2016-11-14/1d/1sec/time/20:23/20:28.json
  jsonReq =   "/activities/heart/date/"+ date +"/1d/1sec/time/"+ fromTime +"/"+ toHour+":"+toMinute+".json";
  // console.log("/activities/heart/date/"+ date +"/1d/1sec/time/"+ fromTime +"/"+ toHour+":"+toMinute+".json");
  client.get(jsonReq, fitbitContent.access_token).then(function (results) {
    // console.log(results[0]['activities-heart-intraday']['dataset']);
    if(results[0]['activities-heart-intraday']['dataset'].length != 0){
      var nomalizeJson = [];
          uid = 1;
      // console.log(results[0]);
      nomalizeJson = normalizeData.normalizeFitbitHR(results[0], uid);
      // console.log(nomalizeJson);
      httptoServer("http://127.0.0.1:5000/saveHR", "POST", nomalizeJson, function(err, res){
        if(!err) console.log("Success!");
      });
    }else{
      console.log("Fitbit don't have data.");
    }
  });
}, 5000);// 1 HR can call only 150 requests, if exceed we will be blocked.
//so 1hr = 3600 seconds, 24 seconds will request 1 time.

setInterval(function() {// do something every period(24 secs)
  var date = new Date();
  var now = mylib.toUnixTimeStamp(date.toISOString());
  var expire = mylib.toUnixTimeStamp(jsonContent.expires_at);
  // Use refresh token to get new access token
  // if(now >= expire){
  //   // console.log(jsonContent.refresh_token);
  //   // console.log(date);
  //   option = {
  //     method : 'POST',
  //     url : "https://api.hexoskin.com/api/connect/oauth2/token/",
  //     qs:{
  //       grant_type:"refresh_token",
  //       refresh_token: jsonContent.refresh_token,
  //     },
  //     header : {
  //       'cache-control': 'no-cache',
  //       authorization : 'Bearer '+ jsonContent.access_token,
  //     },
  //   }
  //   request(option, function(error, res, body){
  //     if(error) console.log(error);
  //     // console.log(res);
  //     console.log(body);
  //   });
  //
  //   console.log("expires_token");
  // }else{
    var toTime = mylib.toHexoSkinTimestamp(date.toISOString());
    date.setMinutes(date.getMinutes()-10);
    var fromTime = mylib.toHexoSkinTimestamp(date.toISOString());
    // console.log(toTime + " " + fromTime);
    var data = {
      user: '11018',          //user = '11018'
      datatype: '19,33',  //datatype
      start: fromTime,
      end: toTime
    }
    // console.log(data);
    var url = "https://api.hexoskin.com/api/data/";
    var access_token = jsonContent.access_token;
    var callbackUrl = 'https://localhost:3001/callback';
    mylib.getHSDataWithToken(url, data, access_token, callbackUrl, function(err,res){
      if(err) console.log(err);
      // console.log(res);
      if(res == "[]"){
        console.log("Hexoskin don't have data.");
      }else{
        var data = JSON.parse(res);
        // console.log(data[0]);
        // console.log(res);
        var nomalizeJsonHr = [];
        normalizeJsonHr = normalizeData.normalizeHexoHR(data[0],1);
        // console.log(normalizeJsonHr);
        mylib.postJson("http://127.0.0.1:5000/saveHR", normalizeJsonHr, function(err, res){
          if(err) console.log(err);
          // console.log("success");
          else console.log(res);
        });
        var nomalizeJsonBr = [];
        nomalizeJsonBr = normalizeData.normalizeHexoBR(res[0]);
        console.log(nomalizeJsonBr);
        mylib.postJson("http://127.0.0.1:5000/saveBR", nomalizeJsonBr, function(err, res){
          if(err) console.log(err);
          // console.log("success");
          else console.log(res);
        });
      }
    });
  // }
}, 10000);


function getFromTime(toMinute, toHour, delayTime){
  if(toMinute<delayTime){
    fromMinute = toMinute+(60-delayTime);
    if(toHour == "0"){
      fromHour = 23;
    }else{
      fromHour = toHour-1;
    }
  }else{
    fromMinute = toMinute-delayTime;
    fromHour = toHour;
  }
  var fromTime = fromHour + ":" + fromMinute;
  return fromTime;
}

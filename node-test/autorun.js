var fs = require('fs');
    bodyParser = require('body-parser');
    request = require('request');
    mylib = require('./controllers/mylib');
    systems = './systems/userToken.json';
    normalizeData = require('./controllers/normalizeData');
    setInterval(function(){
      content = fs.readFileSync(systems);
      jsonContent = JSON.parse(content);
    },4500);
    // console.log(jsonContent);
// // still error
//
// setInterval(function() {// do something every period(24 secs)
//   console.log("Query!!");
//
//   if(mode = "profile" && getAccessToken != ""){
//
//     client.get("/profile.json", getAccessToken).then(function (results) {
//         // sent result to DB
//     });
//   }
//
//   if(mode = "heartrate" && getAccessToken != ""){
//     var delayTime = 15;
//     var now = new Date();
//     var date = now.toISOString().substr(0, 10);
//     // get time
//     var toHour = now.getHours();
//     // if(toHour<10) toHour = "0"+toHour;
//     var toMinute = now.getMinutes();
//     // if(toMinute<10) toMinute = "0"+toMinute;
//     var fromTime = getFromTime(toMinute, toHour, delayTime);
//     // console.log("Old" + fromHour + ":" + fromMinute);
//     // console.log("New" + fromTime);
//
//     // jsonReq Example: /activities/heart/date/2016-11-14/1d/1sec/time/20:23/20:28.json
//     jsonReq =   "/activities/heart/date/"+ date +"/1d/1sec/time/"+ fromHour+":"+fromMinute+"/"+ toHour+":"+toMinute+".json";
//     client.get(jsonReq, getAccessToken).then(function (results) {
//       // console.log(results[0]);
//       if(results[0]['activities-heart-intraday']['dataset'].length != 0){
//         var nomalizeJson = [];
//         nomalizeJson = normalizeData.normalizeFitbitHR(results[0], getUserID);
//         httptoServer("http://127.0.0.1:5000/saveHR", "POST", nomalizeJson, function(err, res){
//           if(!err) console.log("Success!");
//         });
//       }else{
//         console.log("It doesn't have any data in This query");
//       }
//     });
//   }
// }, 5000);// 1 HR can call only 150 requests, if exceed we will be blocked.
//so 1hr = 3600 seconds, 24 seconds will request 1 time.
//
setInterval(function() {// do something every period(24 secs)
  var date = new Date();
  var now = mylib.toUnixTimeStamp(date.toISOString());
  var expire = mylib.toUnixTimeStamp(jsonContent.expires_at);
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
    date.setHours(date.getHours()-60);
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
        console.log("No data");
      }else{
        var data = JSON.parse(res);
        // console.log(data[0]);
        // console.log(res);
        var nomalizeJsonHr = [];
        normalizeJsonHr = normalizeData.normalizeHexoHR(data[0],1);
        // console.log(normalizeJsonHr);
        //var nomalizeJsonBr = normalizeData.normalizeHexoBR(res[0]);
        mylib.postJson("http://127.0.0.1:5000/saveHR", normalizeJsonHr, function(err, res){
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

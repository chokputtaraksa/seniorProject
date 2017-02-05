var request = require('request');


exports.toHexoSkinTimestamp = function(date_time){// date_time: YYYY-MM-DDTHH:MM:SSZ
  if(date_time == 'undefined') return new Error("No data content");
  var date = new Date(date_time.substr(0,4),date_time.substr(5,2)-1,date_time.substr(8,2));
  date.setHours(date_time.substr(11,2));
  date.setMinutes(date_time.substr(14,2));
  date.setSeconds(date_time.substr(17,2));
  // console.log(date);
  return Math.floor(date / 1000)*256;
}

exports.toUnixTimeStamp = function(date_time){
  console.log(date_time);
  if(date_time == 'undefined') return new Error("No data content");
  try{
    var date = new Date(Date.UTC(date_time.substr(0,4),date_time.substr(5,2)-1,date_time.substr(8,2), date_time.substr(11,2), date_time.substr(14,2), date_time.substr(17,2)));
  }catch(error){
    return new Error(error);
  }
    console.log(date);
    return Math.floor(date / 1000);
}

exports.localToUnixTimeStamp = function(date_time){
  // console.log(date_time);
  if(date_time == 'undefined') return new Error("No data content");
  try{
    var date = new Date(date_time.substr(0,4),date_time.substr(5,2)-1,date_time.substr(8,2));
    date.setHours(date_time.substr(11,2));
    date.setMinutes(date_time.substr(14,2));
    date.setSeconds(date_time.substr(17,2));
  }catch(error){
    return new Error(error);
  }
    // console.log(date);
    return Math.floor(date / 1000);
}

exports.HSTStoUTC = function(hexoTimestamp){ //3xxxxxxxxxxx
  if(hexoTimestamp == 'undefined') return new Error("No data content");
  return new Date((hexoTimestamp/256)*1000).toISOString().substr(0,19) + "Z";
}

exports.getHSDataWithToken = function(targetUrl, data, accessToken, redirectUrl, callback){
  var options = {
    method: 'GET',
    url: targetUrl,             //url = 'https://api.hexoskin.com/api/data/'
    qs:{
      user: data.user,          //user = '11018'
      datatype: data.datatype,  //datatype
      start: data.start,
      end: data.end
    },
    headers:
    {
      'cache-control': 'no-cache',
      authorization : 'Bearer '+ accessToken,
    },
    body: '{"redirect_uris": ["' + redirectUrl +'"]}'
  };
  // console.log(options);

  request(options, function (error, response, body) {
    if (error) callback(error, null);;
    callback(null, body);
  });
}

exports.postJson = function(toUrl, object, callback){
  option = {
    method : 'POST',
    url : toUrl,
    header : {
      "content-type" : "application/json",
    },
    body : object,
    json : true,
  }
  request(option, function(error, res, body){
    if(error) callback(error, null);
    callback(null, body);
  });
}

// exports.secureWrite = function(json, path, callback){
//   if(json){
//
//   }
// }

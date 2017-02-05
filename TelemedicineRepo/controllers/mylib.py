from datetime import datetime

def toUTCTime(unixTimestamp):
    try:
        dt = datetime.fromtimestamp(int(unixTimestamp)).strftime('%Y-%m-%dT%H:%M:%SZ')
        return dt
    except:
        return "wrong format"



    # exports.HSTStoUTC = function(hexoTimestamp){ //3xxxxxxxxxxx
    #   if(hexoTimestamp == 'undefined') return new Error("No data content");
    #   return new Date((hexoTimestamp/256)*1000).toISOString().substr(0,19) + "Z";
    # }

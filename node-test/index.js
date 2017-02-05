var fs = require('fs');
    http = require('http');
    https = require('https');
    express = require('express');
    // bcrypt = require('bcrypt');
    autorun = require('./autorun');
    app = express();
    bodyParser = require('body-parser');
    simpleOauthModule = require('simple-oauth2');
    request = require('request');
    mylib = require('./controllers/mylib');
    systems = './systems/userToken.json';
    // oauth2Info = require('./controllers/oauth2');
var privateKey  = fs.readFileSync('SSL/client-key.pem', 'utf8');
    certificate = fs.readFileSync('SSL/client-cert.pem', 'utf8');
    credentials = {key: privateKey, cert: certificate};

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var client_id = "227ZYG";
    secret_id = "8df3c4865e35901f964c090f99213bcf"
    mode = "heartrate";
    redirect_urlfb = 'http://localhost:3000/callback';
    host = "localhost:3000/"
// initialize the Fitbit API client
var FitbitApiClient = require("fitbit-node"),
    client;

    // get code for request access token
app.get("/authfb", function (req, res) {
  client = new FitbitApiClient(client_id, secret_id);
  res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', redirect_urlfb));
});

app.get("/callback", function (req, res) {

  // exchange the authorization code we just received for an access token
  client.getAccessToken(req.query.code, redirect_urlfb).then(function (result) {
    // console.log("Heyyyy");
    // use the access token to fetch the user's profile information
    // get important key
    // var getUserID = result.user_id;
    // var getRefreshToken = result.refresh_token;
    // var getAccessToken = result.access_token;
    // var getExpiredTime = result.expires_in;
    var uid = 1111; // will create user management soon
    result.uid = uid;
    // console.log(token);
    fs.writeFile('./systems/userTokenfb.json',JSON.stringify(result),function(err){
		    if(err) throw err;
        res.send("ok");
		});
    // console.log(getUserID + " : " + getRefreshToken+ " : " +getAccessToken+ " : " +getExpiredTime);

  }).catch(function (error) {
    res.send(error);
  });
});

const oauth2 = simpleOauthModule.create({
  client: {
    id: '6TKpT1Ko1eyAGjocTFQZWW71xN5MNB',
    secret: 'W5DYZiC7OqzJOo9KU7kolQGdop0JzK',
  },
  auth: {
    tokenHost: 'https://api.hexoskin.com',
    tokenPath: '/api/connect/oauth2/token/',
    authorizePath: '/api/connect/oauth2/auth/',
  },
});
// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'https://localhost:3001/callbackhs',
  scope: 'readwrite',
  state: '6145605',
});
// Initial page redirecting to Github
app.get('/authhs', (req, res) => {
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callbackhs', (req, res) => {
  const code = req.query.code;
  const options = {
    code: code,
    redirect_uri: 'https://localhost:3001/callbackhs'
  };
  // console.log(options);
  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json(error.message);
    }
    // console.log("said something");
    //  console.log('The resulting token: ', result);
    var token = oauth2.accessToken.create(result);
    var uid = 1111; // will create user management soon
    token.token.uid = uid;
    // console.log(token);
    fs.writeFile(systems,JSON.stringify(token.token),function(err){
		    if(err) throw err;
        res.sendStatus(200);
		});
  });
});

app.get('/refreshToken', (req,res)=>{
  content = fs.readFileSync(systems);
  jsonContent = JSON.parse(content);
  const tokenObject = {
    'access_token': jsonContent.access_token,
    'refresh_token': jsonContent.refresh_token,
    'expires_in': 0
  };

  // Create the access token wrapper
  var token = oauth2.accessToken.create(tokenObject);
  console.log(token);
  console.log(new Date());
  // Check if the token is expired. If expired it is refreshed.
  if (token.expired()) {
    console.log("expired");
    // Callbacks
    token.refresh((error, result) => {
      token = result;
    })

    // Promises
    token.refresh()
    .then((result) => {
      token = result;
      console.log(token);
      res.sendStatus(200);
    });
  }
});

app.get('/', function(req, res) {
  res.json({ message: 'Welcome to Telecare Repository' });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, ()=>{
  console.log("Start server on port : 3000");
});
httpsServer.listen(3001);

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Headers', 'Content-type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  res.header('Access-Control-Max-Age', 1728000); //预请求缓存20天
  next();
});

var logindata = {
  username: 'admin',
  password: '123456'
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
  let _req = req.body;
  if (logindata.username === _req.userName && logindata.password === _req.password) {
    res.send('success');
  } else {
    res.send('fail');
  }
})


app.listen(3000, function () {
  console.log("success! server is on port 3000");
});

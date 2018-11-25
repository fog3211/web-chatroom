const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// 解决跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header('Access-Control-Allow-Headers', 'Content-type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  res.header('Access-Control-Max-Age', 1728000); //预请求缓存20天
  next();
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 登录
app.post('/login', (req, res) => {
  var _req = req.body;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("chatroom");
    dbo.collection("loginData").find({
      "userName": _req.userName,
    }).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        dbo.collection("loginData").find({
          "userName": _req.userName,
          "password": _req.password,
        }).toArray(function (err, result) {
          if (err) throw err;
          if (result.length > 0) {
            res.send('success');
          } else {
            res.send('fail');
          }
          db.close();
        });
      } else {
        res.send('none');
      }
      db.close();
    });
  });
})

// 注册
app.post('/register', (req, res) => {
  let _req = req.body;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("chatroom");
    dbo.collection("loginData").find({
      "userName": _req.userName
    }).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.send('exist');
      } else {
        var loginObj = {
          "userName": _req.userName,
          "password": _req.password
        }
        dbo.collection("loginData").insertOne(loginObj, function (err, result) {
          if (err) throw err;
          res.send('success');
          db.close();
        });
      }
      db.close();
    });
  });
})

// 修改密码
app.post('/forgetpassword', (req, res) => {
  let _req = req.body;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("chatroom");
    dbo.collection("loginData").find({
      "userName": _req.userName
    }).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        var whereObj = {
          "userName": _req.userName
        }
        var updateObj = {
          $set: {
            "password": _req.password
          }
        };
        dbo.collection("loginData").updateOne(whereObj, updateObj, function (err, result) {
          if (err) throw err;
          res.send("success");
          db.close();
        });
      } else {
        res.send('none');
      }
      db.close();
    });
  });
})

app.listen(3000, function () {
  console.log("success! server is on port 3000");
});

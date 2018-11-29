const LOGIN_SERVER_PORT = 3000;
const CHAT_SERVER_PORT = 3001;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const ws = require("nodejs-websocket")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// 解决跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
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

  MongoClient.connect(url, {useNewUrlParser:true},function (err, db) {
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

  MongoClient.connect(url,{useNewUrlParser:true}, function (err, db) {
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

  MongoClient.connect(url, {useNewUrlParser:true},function (err, db) {
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

app.listen(LOGIN_SERVER_PORT, function () {
  console.log("Login control server running on port :" + LOGIN_SERVER_PORT);
});


// 每进来一个客户端就记录一下
var clientCount = 0;

var chatServer = ws.createServer(function (conn) {
  console.log("New connection")
  clientCount++;
  conn.nickname = 'user' + clientCount;
  let mes = {
    type: "broadcast",
    data: `${conn.nickname} 加入聊天室,欢迎第 ${clientCount} 位用户`
  };
  broadcast(JSON.stringify(mes));
  conn.on("text", function (str) {
    if (!str) return;
    var obj = JSON.parse(str);
    console.log("Received " + obj.name);
    console.log("Received " + obj.data);
    let mes = {
      type: "message",
      name:"obj.name",
      data: `${obj.name}  :  ${obj.data}.`
    };
    broadcast(JSON.stringify(mes));
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed");
    let mes = {};
    mes.type = "broadcast";
    mes.data = conn.nickname + ' left'
    broadcast(JSON.stringify(mes));
  })
  conn.on("error", function (err) {
    console.log(err);
  })
}).listen(CHAT_SERVER_PORT, function () {
  console.log("websocket server running on port: " + CHAT_SERVER_PORT);
});

function broadcast(str) {
  chatServer.connections.forEach(function (conn) {
    conn.sendText(str);
  })
}

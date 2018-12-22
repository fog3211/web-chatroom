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
  res.header("Access-Control-Allow-Origin", "*");
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
  let _req = req.body;

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
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

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    let dbo = db.db("chatroom");
    dbo.collection("loginData").find({
      "userName": _req.userName
    }).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.send('exist');
      } else {
        let loginObj = {
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

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    let dbo = db.db("chatroom");
    dbo.collection("loginData").find({
      "userName": _req.userName
    }).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        let whereObj = {
          "userName": _req.userName
        }
        let updateObj = {
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


// 记录访客数量
let visitorCount = 0;
// 记录当前在线人数
let onlineCount = 0;
//记录在线的名字
let onlineArr = [];


MongoClient.connect(url, {
  useNewUrlParser: true
}, function (err, db) {
  if (err) throw err;
  let dbo = db.db("chatroom");
  let whereStr = {
    "name": '访客人数'
  };
  dbo.collection("visitorNumber").find(whereStr).toArray(function (err, result) {
    if (err) throw err;
    // console.log(result[0]);
    visitorCount = result[0].count;
    db.close();
  });
});

let chatServer = ws.createServer(function (conn) {
  // console.log("New connection")
  visitorCount++;
  // onlineCount++;

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    let dbo = db.db("chatroom");
    let whereStr = {
      "name": '访客人数'
    };
    let updateStr = {
      $set: {
        "count": visitorCount
      }
    };
    dbo.collection("visitorNumber").updateOne(whereStr, updateStr, function (err, res) {
      if (err) throw err;
      db.close();
    });
  });


  conn.on("text", function (str) {
    if (!str) return;
    let obj = JSON.parse(str);
    if (!obj.data) {
      // console.log(visitorCount);
      if (onlineArr.includes(obj.name)) {
        // console.log(onlineArr);
        onlineArr.push(obj.name);
        conn.nickname = obj.name;
        return;
      } else {
        onlineArr.push(obj.name);
        onlineCount++;
      }
      let mes = {
        type: "broadcast",
        data: `${obj.name} 加入聊天室，欢迎第 ${visitorCount} 位访客，当前在线人数为${onlineCount}.`
      };
      conn.nickname = obj.name;
      broadcast(JSON.stringify(mes));
      return;
    }
    let mes = {
      type: "message",
      data: obj.data,
      name: obj.name
    };
    broadcast(JSON.stringify(mes));
  })
  conn.on("close", function (code, reason) {
    // console.log("Connection closed");

    for (let i = 0; i < onlineArr.length; i++) {
      if (onlineArr[i] == conn.nickname) {
        onlineArr[i] = null;
        break;
      }
      onlineArr.splice(onlineArr.indexOf(null), 1);
    }
    if(onlineArr.includes(conn.nickname)){
      // console.log(onlineArr);
      return;
    }
    onlineCount--;
    let mes = {};
    mes.type = "broadcast";
    mes.data = `${conn.nickname} 已离开群聊,当前在线人数为${onlineCount}.`
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

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
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

var logindata = [{
  userName: 'admin',
  password: '123456'
}, {
  userName: 'root',
  password: '123123'
}]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 登录
app.post('/login', (req, res) => {
  setTimeout(() => {
    let _req = req.body;
    let _user = null;
    let hasUser = false;

    hasUser = logindata.some(u => {
      if (u.userName === _req.userName) {
        _user = u;
        return true;
      }
    })
    if (hasUser) {
      if (_user.password === _req.password) {
        res.send('success');
      } else {
        res.send('fail');
      }
    } else {
      res.send('none');
    }
  }, 1000);

})

// 注册
app.post('/register', (req, res) => {
  setTimeout(() => {
    let _req = req.body;
    let hasUser = false;

    hasUser = logindata.some(u => {
      if (u.userName === _req.userName) {
        return true;
      }
    })

    if (hasUser) {
      res.send('exist');
    } else {
      logindata.push({
        userName: _req.userName,
        password: _req.password
      });
      res.send('success');
    }
  }, 1000);
})

// 修改密码
app.post('/forgetpassword', (req, res) => {
  setTimeout(() => {
    let _req = req.body;
    let hasUser = false;

    hasUser = logindata.some(u => {
      if (u.userName === _req.userName) {
        u.password = _req.password;
        res.send('success');
        return true;
      }
    })

    if (!hasUser) {
      res.send('none');
    }
  }, 1000);
})

app.listen(3000, function () {
  console.log("success! server is on port 3000");
});

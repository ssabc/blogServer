var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// 请求
const port = '4001'
app.get('/list', (req, res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://127.0.0.1:27017";
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    var dbo = db.db("myblog");
    dbo.collection("article").find({}).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err;
      console.log(result[0].articlenum);
      const dbNum = result[0].articlenum || 0
      const articles = []
      for(let i=0; i < dbNum; i++) {
        articles.push({
          id: `${i+1}`,
          title: `我的第${i+1}篇文章`,
          desc: "关于react的一些使用技巧、分享给大家，欢迎大家多多指教！",
          publishDate: "2020-01-23"
        })
      } 
      res.send({articles: articles})
      db.close();
    }); 
  });
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

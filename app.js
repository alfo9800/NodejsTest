var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
// 멀티라인 사용기능 추가
var multiline = require('multiline');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);//IoT때문에 주석처리
app.use('/users', users);

//IoT시스템UI 생성
const template = multiline(()=>{/*
<!doctype html>
<html>
	<head>
		<title>컴퓨터 GPIO 입출력 시스템</title>
		<meta charset="UTF-8">
		<script src="https://code.jquery.com/jquery-latest.min.js"></script>
		<style>
			body {
				background-color:black;
				text-align:center;
			}
			p {
				font-size: 50px;
				color: yellow;
			}
			#state {
				font-size: 80px;
				color: red;
				text-decoration: none;
			}
			input[type="button"] {
				width:200px;height:80px;font-size:50px
			}
		</style>
	</head>
	<body>
		<p>
			전등 IoT 시스템
		</p>
		<input type="button" value="켜기" id="on">
		<input type="button" value="끄기" id="off">
		<br>
		<p>
			LED is now <span id="state"></span> 상태
		</p>
	</body>
	<script>
		var state = "off";
		$("#state").text(state);
		$("#on").on("click", function(){
			$.ajax({
				url:"/on",
				method:"get",
				data:"text",
				success:function(result){
					alert(result);
					$("#state").text("on");
					$("body").css("background-color","white");
				},
				error:function(result){
					alert("API서버가 작동하지 않습니다.");
				}
			});
		});
		$("#off").on("click", function(){
			$.ajax({
				url:"/off",
				method:"get",
				data:"text",
				success:function(result){
					alert(result);
					$("#state").text("off");
					$("body").css("background-color","black");
				},
				error:function(result){
					alert("API서버가 작동하지 않습니다.");
				}
			});
		});
	</script>
</html>
*/});
//IoT시스템용 라우터(컨트롤러)=API서버 만들기(아래)
app.get('/', function(req,res){
	res.send(template);			
});
app.get('/on', function(req,res){
	//digitalWrite(11, HIGH); //장비와 연결되었을때 적용
	res.send("전등 ON");
});
app.get('/off', function(req,response){
	//digitalWrite(11, LOW);
	response.send("전동 OFF");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;

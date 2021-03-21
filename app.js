const dotenv = require("dotenv");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config();
//Router importing
const userRouter = require("./routes/user");
const { sequelize } = require("./models");
const { create } = require("domain");

const app = express();
//배포시에는 80 또는 443 사용 , http/https
app.set("port", process.env.PORT || 8001);
// nunjucks
app.set("view engine", "html");
nunjucks.configure("views", {
	express: app,
	watch: true,
});
// force: true 모델이 변경 시, 테이블을 지우고 다시 만듬, 실무에선 force 절대 쓰지 말기.
// alter: true 데이터 유지하고 컬럼 변경, 하지만 기존데이터와 추가된 컬럼과의 에러가 날 수 있음.
sequelize
	.sync({ force: false })
	.then(() => {
		console.log("DB 연결 성공");
	})
	.catch((err) => {
		console.dir(err);
	});
passportConfig();
//middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Router
app.user("/", indexRouter);

//404 Error middleware
app.use((req, res, next) => {
	next(createError(404));
});
//const createError = require('http-errors');
//next(createError(404));

//Error middleware
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	//개발모드일 때는 에러 스택 트레이스 보여주고, 배포중일 땐 안보여줌.
	res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
	res.status(err.status || 500).render("error");
});

app.listen(app.get("port"), () => {
	console.log(app.get("port"), "번 포트 대기중");
});

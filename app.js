const dotenv = require("dotenv");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const swaggerDocs = require("./swagger/swagger");
dotenv.config();
//Router importing
const indexRouter = require("./routes");
const { sequelize } = require("./models");
const { checkIP } = require("./module/middlewares");
const app = express();
//배포시에는 80 또는 443 사용 , http/https
app.set("port", process.env.PORT || 8001);

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
//middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: false, limit: "25mb" }));
app.use(cookieParser());
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.use(checkIP);
app.use(swaggerDocs);

//Router
app.use("/", indexRouter);

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
	res.status(err.status || 500).json({
		message: err.message,
		error: err,
	});
});

app.listen(app.get("port"), () => {
	console.log(app.get("port"), "번 포트 대기중");
});

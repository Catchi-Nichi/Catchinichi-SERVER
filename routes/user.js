const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { UserController } = require("../controllers/userController");
//로그인 안한 사람만 회원가입 가능하게 하기 위해 미들웨어를 넣어줌
router.post("/signup", isNotLoggedIn, UserController.signup);

router.post("/login", isNotLoggedIn, UserController.login);

router.get("/logout", isLoggedIn, UserController.logout);

module.exports = router;

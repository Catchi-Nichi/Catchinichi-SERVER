const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/signup", UserController.signup);
// router.post("/signin", UserController.signin); //로그인
router.post("/checkEmail", UserController.checkEmail); //아아디 중복체크
router.post("/checkNick", UserController.checkNickName); //닉네임 중복체크
router.post("/verifyPhone", UserController.verifyPhone); // 휴대폰 인증
// router.get("/profile", middleware.userJwt, UserController.profile); //프로필 조회
// router.get("/myRoom", middleware.userJwt, UserController.myReviw); // 나의 모임
// router.post("/updateToken", middleware.userJwt, UserController.updateToken); // 디바이스 토큰 업데이트
// router.get("/checkDeviceToken", UserController.checkDeviceToken);
module.exports = router;

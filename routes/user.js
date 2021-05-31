const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/signup", UserController.signup);

router.post("/signin", UserController.signin);

router.post("/checkEmail", UserController.checkEmail);

router.post("/checkNick", UserController.checkNickName); //닉네임 중복체크
router.post("/nick", UserController.NickName); //닉네임 중복체크

router.post("/verifyPhone", UserController.verifyPhone); // 휴대폰 인증

router.post("/addNick", UserController.addNick); // 닉네임 등록
// router.get("/profile", middleware.userJwt, UserController.profile); //프로필 조회
// router.get("/myRoom", middleware.userJwt, UserController.myReviw); // 나의 리뷰
router.post("/kakao", UserController.kakao); // 카카오 로그인

module.exports = router;

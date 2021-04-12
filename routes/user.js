const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관련 API
 * definitions:
 *   User:
 *     type: "object"
 *     properties:
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *       nick:
 *         type: "string"
 *       phone:
 *         type: "string"
 *       gender:
 *         type: "string"
 *       birth:
 *         type: "string"
 *         format: "date"
 */
//email, nick, password, phone, gender, birth
/**
 * @swagger
 * /user/signup:
 *   post:
 *     description: 회원가입
 *     tags: [User]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       description: "회원 가입에 필요한 email, nick, password, phone, gender, birth가 담긴 body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/User"
 *     responses:
 *       "200":
 *         description: "회원가입에 성공하였습니다"
 *
 */
router.post("/signup", UserController.signup);
/**
 * @swagger
 * /user/signin:
 *   post:
 *     description: 로그인
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Email, 비밀번호로 로그인
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: test@gmail.com
 *             password:
 *               type: string
 *               example: qwerasdf
 *     responses:
 *       "200":
 *         description: "로그인에 성공했습니다."
 *       "400":
 *         description: "비밀번호가 올바르지 않습니다."
 *
 */
router.post("/signin", UserController.signin);
/**
 * @swagger
 * /user/checkEmail:
 *   post:
 *     description: 이메일 중복 확인
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: 이메일 중복 확인
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: test@gmail.com
 *     responses:
 *       "200":
 *         description: "사용 가능한 이메일입니다."
 *       "400":
 *         description: "이미 사용중인 이메일입니다."
 *
 */
router.post("/checkEmail", UserController.checkEmail);
/**
 * @swagger
 * /user/checkNick:
 *   post:
 *     description: 닉네임 중복 확인
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nick
 *         description: 닉네임 중복 확인
 *         schema:
 *           type: object
 *           properties:
 *             nick:
 *               type: string
 *               example: test
 *     responses:
 *       "200":
 *         description: "사용 가능한 닉네임입니다."
 *       "400":
 *         description: "이미 사용중인 닉네임입니다."
 *
 */
router.post("/checkNick", UserController.checkNickName); //닉네임 중복체크
/**
 * @swagger
 * /user/verifyPhone:
 *   post:
 *     description: 휴대폰 인증
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: phone
 *         description: 휴대폰 인증
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               example: "+8210"
 *     responses:
 *       "200":
 *         description: "인증번호가 전송되었습니다."
 *       "400":
 *         description: "서버 내부 오류입니다."
 *
 */
router.post("/verifyPhone", UserController.verifyPhone); // 휴대폰 인증
// router.get("/profile", middleware.userJwt, UserController.profile); //프로필 조회
// router.get("/myRoom", middleware.userJwt, UserController.myReviw); // 나의 모임
// router.post("/updateToken", middleware.userJwt, UserController.updateToken); // 디바이스 토큰 업데이트
// router.get("/checkDeviceToken", UserController.checkDeviceToken);
module.exports = router;

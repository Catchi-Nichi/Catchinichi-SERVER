const bcrypt = require("bcrypt");
const User = require("../models/user");
const statusCode = require("../module/statusCode");
const jwt = require("../module/jwt");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);

module.exports = {
	signup: async (req, res) => {
		console.log(req.body);
		const { email, password, phone, gender, age } = req.body;

		try {
			const exUser = await User.findOne({ where: { email } });
			//이미 있는 아이디
			if (exUser) {
				return await res
					.status(statusCode.BAD_REQUEST)
					.send({ success: false, message: "이미 사용중인 이메일입니다." });
			}
			// 비밀번호 hash화, 12는 해쉬 난이도
			const hashedPassword = await bcrypt.hash(password, 12);
			await User.create({
				email: email,
				password: hashedPassword,
				phone,
				gender,
				age,
			});
			return await res
				.status(statusCode.OK)
				.send({ success: true, message: "회원가입에 성공하였습니다", email });
		} catch (err) {
			console.log(err);
			await res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	checkEmail: async (req, res) => {
		const { email } = req.body;

		if (!email) {
			return res
				.status(statusCode.BAD_REQUEST)
				.send({ success: false, message: "이메일을 입력해주세요." });
		}

		const exUser = await User.findOne({ where: { email } });
		//이미 있는 아이디
		if (exUser) {
			return await res
				.status(statusCode.BAD_REQUEST)
				.send({ success: false, message: "이미 사용중인 이메일입니다." });
		}

		return res.status(statusCode.OK).send({ success: true, message: "사용 가능한 이메일입니다." });
	},
	checkNickName: async (req, res) => {
		const { nick } = req.body;
		if (!nick) {
			return res
				.status(statusCode.BAD_REQUEST)
				.send({ success: false, message: "닉네임을 입력해주세요." });
		}

		const exUser = await User.findOne({ where: { nick } });
		//이미 있는 아이디
		if (exUser) {
			return await res
				.status(statusCode.BAD_REQUEST)
				.send({ success: false, message: "이미 사용중인 닉네임입니다." });
		}

		return res.status(statusCode.OK).send({ success: true, message: "사용 가능한 닉네임입니다." });
	},
	verifyPhone: async (req, res) => {
		// 6자리 난수 생성
		const randomNumber = Math.floor(Math.random() * 1000000) + 1;
		try {
			const { phone } = req.body;
			const result = await twilio.messages.create({
				body: `Catchi Nichi 인증번호 [${randomNumber}]를 입력해주세요`,
				from: process.env.TWILIO_PHONE_NUMBER,
				to: phone,
			});
			console.log(result);
			if (result) {
				return res.status(statusCode.OK).send({
					success: true,
					message: "인증번호가 전송되었습니다.",
					randomNumber: randomNumber,
				});
			} else {
				return res
					.status(statusCode.INTERNAL_SERVER_ERROR)
					.send({ success: false, message: "서버 내부 오류입니다." });
			}
		} catch (error) {
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	signin: async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			res
				.status(statusCode.BAD_REQUEST)
				.send({ success: false, message: "이메일과 비밀번호를 입력해주세요." });
		}
		try {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return await res
					.status(statusCode.NOT_FOUND)
					.send({ success: false, message: "가입되지 않은 이메일입니다." });
			}

			const comparePassword = await bcrypt.compare(password, user.dataValues.password);
			console.log(comparePassword);
			if (!comparePassword) {
				return res.status(statusCode.BAD_REQUEST).send({
					success: false,
					message: "비밀번호가 올바르지 않습니다.",
				});
			}

			const { token, refreshToken } = await jwt.sign(user.dataValues);
			return res.status(statusCode.OK).send({
				success: true,
				message: "로그인에 성공했습니다.",
				accessToken: token,
				refreshToken,
				email,
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	kakao: async (req, res) => {
		console.log(req.body);
		const { email, gender, age, snsId } = req.body;

		try {
			const exUser = await User.findOne({ where: { email } });
			//이미 있는 아이디
			if (exUser) {
				const { token, refreshToken } = await jwt.sign(exUser);
				return await res.status(statusCode.OK).send({
					success: true,
					message: "로그인에 성공하였습니다.",
					accessToken: token,
					refreshToken,
					email,
				});
			}
			await User.create({
				email,
				gender,
				age,
				snsId,
				provider: "kakao",
			});
			const { token, refreshToken } = await jwt.sign(email);
			return await res.status(statusCode.OK).send({
				success: true,
				message: "로그인에 성공하였습니다.",
				accessToken: token,
				refreshToken,
				email,
			});
		} catch (err) {
			console.log(err);
			await res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
};

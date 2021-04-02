const bcrpyt = require("bcrypt");
const User = require("../models/user");
const statusCode = require("../module/statusCode");
const jwt = require("../module/jwt");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);

module.exports = {
	signup: async (req, res) => {
		console.log(req.body);
		const { email, nick, password, phone, gender, birth } = req.body;

		try {
			const exUser = await User.findOne({ where: { email } });
			//이미 있는 아이디
			if (exUser) {
				return await res
					.status(statusCode.BAD_REQUEST)
					.send({ success: false, message: "이미 사용중인 이메일입니다." });
			}
			// 비밀번호 hash화, 12는 해쉬 난이도
			const hashedPassword = await bcrpyt.hash(password, 12);
			await User.create({
				email: email,
				nick,
				password: hashedPassword,
				phone,
				gender,
				birth,
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
};

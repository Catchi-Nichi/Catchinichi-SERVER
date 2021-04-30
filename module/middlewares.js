const statusCode = require("./statusCode");
const jwt = require("./jwt");

module.exports = {
	verifyToken: async (req, res, next) => {
		const token = req.headers.token;
		try {
			console.log("token : ", token);
			const decoded = jwt.verify(token);
			if (!decoded) {
				return res
					.status(statusCode.BAD_REQUEST)
					.send({ success: false, message: "토큰을 확인해주세요." });
			}
			if (decoded == -2) {
				return res.status(statusCode.UNAUTHORIZED).json({
					success: false,
					message: "토큰이 만료되었습니다.",
				});
			}

			if (decoded == -1) {
				return res
					.status(statusCode.UNAUTHORIZED)
					.send({ success: false, message: "잘못된 토큰입니다." });
			}

			if (decoded.email === undefined) {
				return res
					.status(statusCode.UNAUTHORIZED)
					.send({ success: false, message: "잘못된 토큰입니다." });
			}
			req.userEmail = decoded.email;
			next();
		} catch (err) {
			console.log(err);
		}
	},
	// refreshToken 검증
	refreshToken: async (req, res) => {
		const refreshToken = req.headers.refreshtoken;
		try {
			if (!refreshToken) {
				return res
					.status(statusCode.BAD_REQUEST)
					.send({ success: false, message: "토큰을 확인해주세요." });
			}

			const newToken = await jwt.refresh(refreshToken);

			if (newToken == -2) {
				return res.status(statusCode.UNAUTHORIZED).json({
					success: false,
					message: "토큰이 만료되었습니다.",
				});
			}

			if (newToken == -1) {
				return res
					.status(statusCode.UNAUTHORIZED)
					.send({ success: false, message: "잘못된 토큰입니다." });
			}

			return res.status(statusCode.OK).send({
				success: true,
				message: "토큰이 재발급되었습니다.",
				accessToken: newToken.accessToken,
				refreshToken: newToken.refreshToken,
			});
		} catch (err) {
			console.log(err);
		}
	},
	checkIP: (req, res, next) => {
		const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
		console.log("Access ip:" + ip);
		next();
	},
};

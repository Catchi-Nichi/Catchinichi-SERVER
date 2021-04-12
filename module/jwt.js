const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = {
	sign: async (user) => {
		const { email } = user;
		const payload = {
			email,
		};
		const options = {
			expiresIn: "2h",
		};
		const refreshOptions = {
			expiresIn: "15d",
		};
		const result = {
			token: jwt.sign(payload, process.env.JWT_SECRET, options),
			refreshToken: jwt.sign(payload, process.env.JWT_SECRET, refreshOptions),
		};
		await User.update({ token: result.refreshToken }, { where: { email } });
		return result;
	},
	verify: async (token) => {
		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			return decoded;
		} catch (err) {
			if (error.name === "TokenExpiredError") {
				return -2;
			}
			return -1;
		}
	},
	refresh: async (refreshToken) => {
		try {
			const result = jwt.verify(refreshToken, process.env.JWT_SECRET);
			let { email } = result;
			console.log(email);
			if (result.email === undefined) {
				return -1;
			}
			const user = await User.findOne({ where: { email } });
			const { token } = user;
			if (refreshToken !== token) {
				return -1;
			}
			const payload = {
				email: user.email,
			};
			const options = {
				expiresIn: "2h",
			};
			const refreshOptions = {
				expiresIn: "15d",
			};
			const tokens = {
				accessToken: jwt.sign(payload, process.env.JWT_SECRET, options),
				refreshToken: jwt.sign(payload, process.env.JWT_SECRET, refreshOptions),
			};
			await User.update({ token: tokens.refreshToken }, { where: { email: payload.email } });
			return tokens;
		} catch (err) {
			console.log("jwt.js ERROR : ", err);
		}
	},
};

const Fragrance = require("../models/fragrance");
const statusCode = require("../module/statusCode");
const Like = require("../models/like");
module.exports = {
	fragranceAll: async (req, res) => {
		try {
			const fragranceList = await Fragrance.findAll({ order: [["likes", "DESC"]], limit: 10 });
			const countingList = fragranceList.length;
			return res.status(statusCode.OK).send({
				success: true,
				message: `${countingList}개의 향수가 검색되었습니다.`,
				fragranceList,
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "향수를 불러오는 도중 에러가 발생했습니다.",
			});
		}
	},

	fragrance: async (req, res) => {
		const { brand, fragrance } = req.params;

		try {
			//향수 기본 데이터
			const fragranceData = await Fragrance.findAll({
				where: { kr_brand: brand, kr_name: fragrance },
			});
			return res.status(statusCode.OK).send({
				success: true,
				message: `${fragrance}의 정보를 불러왔습니다.`,
				fragranceData,
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "향수를 불러오는 도중 에러가 발생했습니다.",
			});
		}
	},
	like: async (req, res) => {
		const { nick, brand, fragrance } = req.body;

		try {
			await Like.create({
				UserNick: nick,
				brand,
				en_name: fragrance,
			});
			await Fragrance.update(
				{ countingReview: Sequelize.literal("likes + 1") },
				{ where: { brand, fragrance } }
			);
			return res.status(statusCode.OK).send({
				success: true,
				message: "좋아요",
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "서버 내부 에러가 발생했습니다.",
			});
		}
	},
	unlike: async (req, res) => {
		const { nick, brand, fragrance } = req.body;

		try {
			await Like.destroy({
				where: {
					UserNick: nick,
					brand,
					en_name: fragrance,
				},
			});
			await Fragrance.update(
				{ countingReview: Sequelize.literal("likes - 1") },
				{ where: { brand, fragrance } }
			);
			return res.status(statusCode.OK).send({
				success: true,
				message: "좋아요 취소",
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "서버 내부 에러가 발생했습니다.",
			});
		}
	},
};

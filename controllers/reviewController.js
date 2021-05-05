const Fragrance = require("../models/fragrance");
const statusCode = require("../module/statusCode");
const Review = require("../models/review");
const Sequelize = require("sequelize");

module.exports = {
	addReview: async (req, res) => {
		const { nick, kr_brand, kr_name, stars, longevity, mood, comment } = req.body;

		try {
			await Review.create({ UserNick: nick, kr_brand, kr_name, stars, longevity, mood, comment });
			await Fragrance.update(
				{ countingReview: Sequelize.literal("countingReview + 1") },
				{ where: { kr_name } }
			);

			const fragrance = await Fragrance.findOne({ where: { kr_brand, kr_name } });

			let { avgStars, countingReview } = fragrance.dataValues;
			avgStars = (avgStars * (countingReview - 1) + stars) / countingReview;

			await Fragrance.update({ avgStars }, { where: { kr_brand, kr_name } });

			return res
				.status(statusCode.OK)
				.send({ success: true, message: "리뷰가 성공적으로 등록되었습니다." });
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
};

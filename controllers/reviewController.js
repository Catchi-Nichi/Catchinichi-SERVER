const Fragrance = require("../models/fragrance");
const statusCode = require("../module/statusCode");
const Review = require("../models/review");
const Sequelize = require("sequelize");

module.exports = {
	addReview: async (req, res) => {
		const { nick, brand, en_name, kr_name, kr_brand, category, stars, longevity, mood, comment } =
			req.body;

		try {
			await Review.create({
				UserNick: nick,
				brand,
				en_name,
				kr_brand,
				kr_name,
				category,
				stars,
				longevity,
				mood,
				comment,
			});
			await Fragrance.update(
				{ countingReview: Sequelize.literal("countingReview + 1") },
				{ where: { brand, en_name } }
			);

			const fragrance = await Fragrance.findOne({ where: { brand, en_name } });
			let { avgStars, countingReview } = fragrance.dataValues;
			avgStars = (avgStars * (countingReview - 1) + parseInt(stars)) / countingReview;
			await Fragrance.update({ avgStars }, { where: { brand, en_name } });

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
	loadReview: async (req, res) => {
		const { brand, fragrance } = req.params;

		try {
			const review = await Review.findAll({
				include: [{ model: Fragrance, attributes: ["img"] }],
				where: {
					kr_brand: brand,
					kr_name: fragrance,
				},
			});

			const countingReview = review.length;
			return res.status(statusCode.OK).send({
				success: true,
				message: "리뷰를 불러왔습니다.",
				review,
				countingReview,
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "리뷰를 불러오는 도중 에러가 발생했습니다.",
			});
		}
	},
	myReview: async (req, res) => {
		const { nick } = req.params;

		try {
			const reviewList = await Review.findAll({
				include: [{ model: Fragrance }],
				where: { Usernick: nick },
			});
			const countingReview = reviewList.length;
			return res.status(statusCode.OK).send({
				success: true,
				message: "리뷰를 불러왔습니다.",
				reviewList,
				countingReview,
			});
		} catch (err) {
			console.log(err);
			return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "리뷰를 불러오는 도중 에러가 발생했습니다.",
			});
		}
	},
	updateReview: async (req, res) => {
		const idx = req.params.id;
		const { stars, longevity, mood, comment, brand, en_name } = req.body;

		try {
			await Review.update(
				{
					stars,
					longevity,
					mood,
					comment,
				},
				{ where: { id: idx } }
			);

			const fragrance = await Fragrance.findOne({ where: { brand, en_name } });

			let { avgStars, countingReview } = fragrance.dataValues;
			avgStars = (avgStars * (countingReview - 1) + parseInt(stars)) / countingReview;
			await Fragrance.update({ avgStars }, { where: { brand, en_name } });

			return res
				.status(statusCode.OK)
				.send({ success: true, message: "리뷰가 성공적으로 수정되었습니다." });
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	deleteReview: async (req, res) => {
		const idx = req.params.id;

		try {
			await Review.destroy({
				where: {
					id: parseInt(idx),
				},
			});
			return res.status(statusCode.OK).send({
				success: true,
				message: "해당 리뷰가 삭제되었습니다.",
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
};

const statusCode = require("../module/statusCode");
const Memo = require("../models/memo");
const Fragrance = require("../models/fragrance");
const sequelize = require("sequelize");
module.exports = {
	addMemo: async (req, res) => {
		const { nick, brand, fragrance, comment } = req.body;
		try {
			await Memo.create({
				nick,
				kr_brand: brand,
				kr_name: fragrance,
				comment,
			});
			return res
				.status(statusCode.OK)
				.send({ success: true, message: "시향노트가 성공적으로 등록되었습니다." });
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	updateMemo: async (req, res) => {
		const idx = req.params.id;
		const { comment } = req.body;
		try {
			await Memo.update(
				{
					comment,
				},
				{ where: { id: parseInt(idx) } }
			);
			return res
				.status(statusCode.OK)
				.send({ success: true, message: "시향노트가 성공적으로 수정되었습니다." });
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	deleteMemo: async (req, res) => {
		const idx = req.params.id;

		try {
			await Memo.destroy({
				where: {
					id: parseInt(idx),
				},
			});
			return res.status(statusCode.OK).send({
				success: true,
				message: "해당 시향노트가 삭제되었습니다.",
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	loadAllMemo: async (req, res) => {
		const { nick } = req.params;
		try {
			const memoList = await Memo.findAll({
				attributes: [
					"id",
					"kr_brand",
					"kr_name",
					"comment",
					[sequelize.fn("date_format", sequelize.col("updatedAt"), "%Y-%m-%d %h:%i"), "updatedAt"],
				],
				include: [{ model: Fragrance, attributes: ["img", "likes", "avgStars"] }],
				where: { nick },
			});
			return res.status(statusCode.OK).send({
				success: true,
				message: "해당 사용자의 시향노트를 불러왔습니다.",
				memoList,
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
	loadOneMemo: async (req, res) => {
		const idx = req.params.id;
		try {
			const memoList = await Memo.findOne({
				attributes: [
					"id",
					"kr_brand",
					"kr_name",
					"comment",
					[sequelize.fn("date_format", sequelize.col("updatedAt"), "%Y-%m-%d %h:%i"), "updatedAt"],
				],
				include: [{ model: Fragrance, attributes: ["img", "likes", "avgStars"] }],
				where: { id: parseInt(idx) },
			});
			console.log(memoList);
			return res.status(statusCode.OK).send({
				success: true,
				message: "해당 시향노트를 불러왔습니다.",
				memoList,
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "서버 내부 오류입니다." });
		}
	},
};

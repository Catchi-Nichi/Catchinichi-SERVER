const statusCode = require("../module/statusCode");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const Fragrance = require("../models/fragrance");
const path = require("path");
const { PythonShell } = require("python-shell");

module.exports = {
	moodRecommend: async (req, res) => {
		const { category1, category2 } = req.query;
		const SQL_MOOD_RECOMMEND_QUERY = `SELECT distinct S.* FROM catchiNichi.notes as T,catchiNichi.notes as B,catchiNichi.fragrances as S where T.category = :category1 and B.category = :category2 and T.name = B.name and T.name = S.en_name limit 5;`;
		const SQL_SECOND_MOOD_RECOMMEND_QUERY = `SELECT distinct S.* FROM catchiNichi.notes as T, catchiNichi.fragrances as S where T.category = :category1 and T.name = S.en_name order by S.countingReview DESC limit 5;`;
		try {
			let recommendList = await sequelize.query(SQL_MOOD_RECOMMEND_QUERY, {
				replacements: { category1, category2 },
				type: QueryTypes.SELECT,
				raw: true,
			});

			if (recommendList.length < 1) {
				recommendList = await sequelize.query(SQL_SECOND_MOOD_RECOMMEND_QUERY, {
					replacements: { category1 },
					type: QueryTypes.SELECT,
					raw: true,
				});
			}

			return res.status(statusCode.OK).send({
				success: true,
				message: `추천 향수를 불러왔습니다.`,
				recommendList,
			});
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "검색 중 에러가 발생하였습니다." });
		}
	},
	personalRecommend: (req, res) => {
		const { nick } = req.params;

		const options = {
			pythonPath: "python3.8",
			scriptPath: path.join(__dirname, "../recommender"),
			args: [nick],
		};

		PythonShell.run("user_based.py", options, async function (err, data) {
			if (err) console.log(err);
			const findingList = JSON.parse(data).detected;
			if (findingList.length < 1) {
				const searchList = await Fragrance.findAll({
					limit: 5,
					order: [["likes", "DESC"]],
				});
				res.status(statusCode.OK).send({
					success: true,
					message: `향수가 검색되었습니다.`,
					searchList,
				});
			} else {
				const result = await findingList.map(async (obj) => {
					let db = await Fragrance.findOne({
						where: {
							brand: obj.brand,
							en_name: obj.name,
						},
					});
					return db;
				});
				const searchList = await Promise.all(result);
				res.status(statusCode.OK).send({
					success: true,
					message: `향수가 검색되었습니다.`,
					searchList,
				});
			}
		});
	},
};

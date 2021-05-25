const statusCode = require("../module/statusCode");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

const { PythonShell } = require("python-shell");

module.exports = {
	moodRecommend: async (req, res) => {
		const { category1, category2 } = req.query;
		const SQL_MOOD_RECOMMEND_QUERY = `SELECT distinct S.* FROM catchiNichi.notes as T,catchiNichi.notes as B,catchiNichi.fragrances as S where T.category = :category1 and B.category = :category2 and T.name = B.name and T.name = S.en_name limit 5;`;

		try {
			const recommendList = await sequelize.query(SQL_MOOD_RECOMMEND_QUERY, {
				replacements: { category1, category2 },
				type: QueryTypes.SELECT,
				raw: true,
			});
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
	personalRecommend: async (req, res) => {},
};

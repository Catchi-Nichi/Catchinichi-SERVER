const Fragrance = require("../models/fragrance");
const statusCode = require("../module/statusCode");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
module.exports = {
	search: async (req, res) => {
		let { searchText, order, limit, offset } = req.query;
		if (limit == undefined) {
			limit = 999;
		}
		if (offset == undefined) {
			offset = 0;
		}
		searchText = `%${searchText.replace(/ /gi, "%")}%`;
		const query = `select * from fragrances where replace(kr_brand," ","") like :searchText or replace(brand," ","") like :searchText or replace(kr_name," ","") like :searchText or replace(en_name," ","") like :searchText order by ${order} DESC limit ${limit} offset ${offset}`;
		try {
			const searchList = await sequelize.query(query, {
				replacements: { searchText: searchText, order: order },
				type: QueryTypes.SELECT,
				raw: true,
			});

			const countingList = searchList.length;
			res
				.status(statusCode.OK)
				.send({ success: true, message: `${countingList}개의 향수가 검색되었습니다.`, searchList });
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "검색 중 에러가 발생하였습니다." });
		}
	},
};

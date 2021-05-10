const statusCode = require("../module/statusCode");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const Fragrance = require("../models/fragrance");
const fs = require("fs").promises;
const path = require("path");
const { PythonShell } = require("python-shell");
module.exports = {
	search: async (req, res) => {
		let { searchText, order, limit, offset, category } = req.query;
		let categoryText = "";
		if (limit == undefined) {
			limit = 999;
		}
		if (offset == undefined) {
			offset = 0;
		}
		if (category == 1) {
			categoryText = "category = 1 and";
		}
		searchText = `%${searchText.replace(/ /gi, "%")}%`;

		const SQL_SEARCH_MUCH_QUERY = `select count(*) as counting from fragrances where ${categoryText} replace(kr_brand," ","") like :searchText or replace(brand," ","") like :searchText or replace(kr_name," ","") like :searchText or replace(en_name," ","") like :searchText`;

		const SQL_SEARCH_QUERY = `select * from fragrances where ${categoryText} replace(kr_brand," ","") like :searchText or replace(brand," ","") like :searchText or replace(kr_name," ","") like :searchText or replace(en_name," ","") like :searchText order by ${order} DESC limit ${limit} offset ${offset}`;
		try {
			if (offset == 0) {
				const lengthList = await sequelize.query(SQL_SEARCH_MUCH_QUERY, {
					replacements: { searchText: searchText },
					type: QueryTypes.SELECT,
					raw: true,
				});
				const countingList = await lengthList[0].counting;

				const searchList = await sequelize.query(SQL_SEARCH_QUERY, {
					replacements: { searchText: searchText },
					type: QueryTypes.SELECT,
					raw: true,
				});

				console.log(countingList);
				return res.status(statusCode.OK).send({
					success: true,
					message: `${countingList}개의 향수가 검색되었습니다.`,
					searchList,
					count: countingList,
				});
			} else {
				const searchList = await sequelize.query(SQL_SEARCH_QUERY, {
					replacements: { searchText: searchText },
					type: QueryTypes.SELECT,
					raw: true,
				});
				res.status(statusCode.OK).send({
					success: true,
					message: `향수가 검색되었습니다.`,
					searchList,
				});
			}
		} catch (err) {
			console.log(err);
			return res
				.status(statusCode.INTERNAL_SERVER_ERROR)
				.send({ success: false, message: "검색 중 에러가 발생하였습니다." });
		}
	},
	pictureSearch: async (req, res) => {
		console.log(req.file);
		try {
			let options = {
				pythonPath: "/usr/bin/python",
				scriptPath: path.join(__dirname, "../label_recog"),
				args: [path.join(__dirname, "../search/") + req.file.filename],
			};
			PythonShell.run("untitled0.py", options, async function (err, data) {
				if (err) console.log(err);
				const findingList = JSON.parse(data).detected;
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
			});
		} catch (err) {
			console.log(err);
			res.status(statusCode.INTERNAL_SERVER_ERROR).send({
				success: false,
				err: err,
			});
		}
	},
	pictureBase64: (req, res) => {
		const { file } = req.body;
		const buff = Buffer.from(file, "base64");
		const filename = path.join(__dirname, "../search") + `/${Date.now()}.jpg`;
		fs.writeFile(filename, buff)
			.then((data) => {
				let options = { scriptPath: path.join(__dirname, "../label_recog"), args: [filename] };
				PythonShell.run("untitled0.py", options, async function (err, data) {
					if (err) console.log(err);
					const findingList = JSON.parse(data).detected;
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
				});
			})
			.catch((err) => {
				console.error(err);
				res.status(statusCode.INTERNAL_SERVER_ERROR).send({
					success: false,
					err: err,
				});
			});

		return res.status(statusCode.OK).send({
			success: true,
			message: "이미지가 저장되었습니다",
			filename,
		});
	},
};

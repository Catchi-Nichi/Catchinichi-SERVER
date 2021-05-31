const statusCode = require("../module/statusCode");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const Fragrance = require("../models/fragrance");
const fs = require("fs").promises;
const path = require("path");
const { PythonShell } = require("python-shell");
const bmp = require("bmp-js");
const Jimp = require("jimp");

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

		const SQL_SEARCH_MUCH_QUERY = `select count(*) as counting from fragrances where ${categoryText} (replace(kr_brand," ","") like :searchText or replace(brand," ","") like :searchText or replace(kr_name," ","") like :searchText or replace(en_name," ","") like :searchText)`;

		const SQL_SEARCH_QUERY = `select * from fragrances where ${categoryText} (replace(kr_brand," ","") like :searchText or replace(brand," ","") like :searchText or replace(kr_name," ","") like :searchText or replace(en_name," ","") like :searchText) order by ${order} DESC limit ${limit} offset ${offset}`;
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
		try {
			let options = {
				pythonPath: "python3",
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
				fs.unlink(path.join(__dirname, "../search/") + req.file.filename, (err) => {
					if (err) console.log(err);
				});
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
	pictureBinary: (req, res) => {
		const { file } = req.body;
		const bmpBuffer = fs.readFileSync(file);
		Jimp.read(bmpBuffer, function (err, image) {
			if (err) {
				console.log(err);
			} else {
				const filename = path.join(__dirname, "../search") + `/${Date.now()}.jpeg`;
				image.write(filename);
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
					// 사진 삭제
					// fs.unlink(filename, (err) => {
					// 	if (err) console.log(err);
					// });
					res.status(statusCode.OK).send({
						success: true,
						message: `향수가 검색되었습니다.`,
						searchList,
					});
				});
			}
		});
	},
	pictureBase64: (req, res) => {
		const { file } = req.body;
		const imageBuffer = Buffer.from(file, "base64");
		const filename = path.join(__dirname, "../search") + `/${Date.now()}.jpeg`;
		fs.writeFile(filename, imageBuffer)
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
					// 사진 삭제
					// fs.unlink(filename, (err) => {
					// 	if (err) console.log(err);
					// });
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
	},
	similar: (req, res) => {
		const { brand, fragrance } = req.body;

		const options = {
			scriptPath: path.join(__dirname, "../recommender"),
			args: [brand, fragrance],
		};

		PythonShell.run("similar_fragrance.py", options, async function (err, data) {
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
	},
};

const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/searchController");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
const fs = require("fs");

AWS.config.update({
	accessKeyId: process.env.S3_AWSAccessKeyId,
	secretAccessKey: process.env.S3_AWSSecretKey,
	region: "ap-northeast-2",
});

try {
	fs.readdirSync("search");
} catch (error) {
	console.error("search 폴더가 없어 search 폴더를 생성합니다.");
	fs.mkdirSync("search");
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, "search/");
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
});
const uploadS3 = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: "catchinichi",
		key(req, file, cb) {
			cb(null, `search/${Date.now()}${path.basename(file.originalname)}`);
		},
	}),
});
router.get("/", SearchController.search); //향수 검색
router.post("/picture", upload.single("file"), SearchController.pictureSearch); // 향수 사진 검색
module.exports = router;

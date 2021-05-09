const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/searchController");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
AWS.config.update({
	accessKeyId: process.env.S3_AWSAccessKeyId,
	secretAccessKey: process.env.S3_AWSSecretKey,
	region: "ap-northeast-2",
});
const upload = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: "catchinichi",
		key(req, file, cb) {
			cb(null, `search/${Date.now()}${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
});
router.get("/", SearchController.search); //향수 검색
router.post("/picture", upload.single("file"), SearchController.pictureSearch); // 향수 사진 검색
module.exports = router;

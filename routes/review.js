const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");

router.post("/addReview", ReviewController.addReview); // 리뷰 등록

module.exports = router;

const express = require("express");
const router = express.Router();
const RecommendController = require("../controllers/recommendController");

router.get("/mood", RecommendController.moodRecommend);
router.get("/personal", RecommendController.personalRecommend);

module.exports = router;

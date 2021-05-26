const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");

router.post("/addReview", ReviewController.addReview); // 리뷰 등록
router.get("/:nick", ReviewController.myReview); // 내 리뷰 확인하기
router.get("/:brand/:fragrance", ReviewController.loadReview); // 해당 향수 리뷰 불러오기
router.patch("/update/:id", ReviewController.updateReview); // 리뷰 수정
router.get("/delete/:id", ReviewController.deleteReview); // 리뷰 삭제

module.exports = router;

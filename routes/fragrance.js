const express = require("express");
const router = express.Router();
const FragranceController = require("../controllers/fragranceController");

router.get("/all", FragranceController.fragranceAll);
router.get("/:brand/:fragrance", FragranceController.fragrance); //각각의 향수 불러오기
router.post("/like", FragranceController.like);
router.post("/unlike", FragranceController.unlike);
module.exports = router;

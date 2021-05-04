const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/searchController");

router.get("/", SearchController.search); //향수 검색

module.exports = router;

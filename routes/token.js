const express = require("express");
const router = express.Router();
const userJwt = require("../module/middlewares");

router.get("/request", userJwt.refreshToken); //액세스토큰 재발급

module.exports = router;

const express = require("express");
const router = express.Router();
const userJwt = require("../module/middlewares");

router.get("/request", userJwt.refreshToken);

module.exports = router;

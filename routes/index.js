const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/auth", require("./token"));
router.use("/fragrance", require("./fragrance"));
router.use("/search", require("./search"));

module.exports = router;

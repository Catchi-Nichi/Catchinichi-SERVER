const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	return res.status(200).send({ message: "main" });
});
router.use("/user", require("./user"));
router.use("/auth", require("./token"));
router.use("/fragrance", require("./fragrance"));
router.use("/search", require("./search"));
router.use("/review", require("./review"));
router.use("/memo", require("./memo"));
router.use("/recommend", require("./recommend"));

module.exports = router;

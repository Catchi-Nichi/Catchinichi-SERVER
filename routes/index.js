const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	return res.status(200).send({ message: "main" });
});
router.use("/user", require("./user"));
router.use("/auth", require("./token"));
router.use("/fragrance", require("./fragrance"));
router.use("/search", require("./search"));

module.exports = router;

const express = require("express");
const router = express.Router();
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggersJsdoc = require("swagger-jsdoc");

const options = {
	swaggerDefinition: {
		info: {
			title: "Catchi Nichi API Docs",
			version: "1.0.0",
			description: "캡스톤디자인(2) 1조 API 문서",
		},
		host: "localhost:8001",
		basePath: "/",
	},
	apis: [path.resolve(__dirname, "../routes/*.js")],
};

const specs = swaggersJsdoc(options);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

module.exports = router;

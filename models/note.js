const Sequelize = require("sequelize");

module.exports = class Note extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				brand: {
					type: Sequelize.STRING(50),
					primaryKey: true,
				},
				name: {
					type: Sequelize.STRING(100),
					primaryKey: true,
				},
				category: {
					type: Sequelize.STRING(45),
				},
				note: {
					type: Sequelize.STRING(45),
					primaryKey: true,
				},
				time: {
					type: Sequelize.ENUM("TOP", "MID", "BOT"),
				},
			},
			{
				sequelize,
				timestamps: false,
				underscored: false,
				modelName: "Note",
				tableName: "notes",
				//DeletedAt
				paranoid: false,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}
};

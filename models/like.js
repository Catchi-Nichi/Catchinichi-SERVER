const Sequelize = require("sequelize");

module.exports = class Like extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				brand: {
					type: Sequelize.STRING(50),
				},
				en_name: {
					type: Sequelize.STRING(100),
				},
			},
			{
				sequelize,
				timestamps: false,
				underscored: false,
				modelName: "Like",
				tableName: "likes",
				//DeletedAt
				paranoid: false,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	static associate(db) {
		db.Like.belongsTo(db.User);
	}
};

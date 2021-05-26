const Sequelize = require("sequelize");

module.exports = class Review extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				kr_brand: {
					type: Sequelize.STRING(20),
				},
				kr_name: {
					type: Sequelize.STRING(45),
				},
				stars: {
					type: Sequelize.FLOAT,
				},
				longevity: {
					type: Sequelize.FLOAT,
				},
				category: {
					type: Sequelize.INTEGER,
				},
				mood: {
					type: Sequelize.STRING(10),
				},
				comment: {
					type: Sequelize.STRING(255),
				},
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
				modelName: "Review",
				tableName: "reviews",
				//DeletedAt
				paranoid: false,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	static associate(db) {
		db.Review.belongsTo(db.User);
		db.Review.belongsTo(db.Fragrance, { foreignKey: "kr_name" });
	}
};

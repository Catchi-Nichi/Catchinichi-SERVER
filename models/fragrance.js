const Sequelize = require("sequelize");

module.exports = class Fragrance extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				brand: {
					type: Sequelize.STRING(50),
					primaryKey: true,
				},
				kr_brand: {
					type: Sequelize.STRING(20),
				},
				en_name: {
					type: Sequelize.STRING(100),
					primaryKey: true,
				},
				kr_name: {
					type: Sequelize.STRING(45),
				},
				img: {
					type: Sequelize.STRING(255),
				},
				category: {
					type: Sequelize.ENUM("all", "nichi"),
				},
				likes: {
					type: Sequelize.INTEGER,
				},
				countingReview: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				avgStars: {
					type: Sequelize.DECIMAL(3, 2),
					defaultValue: 0,
				},
			},
			{
				sequelize,
				timestamps: false,
				underscored: false,
				modelName: "Fragrance",
				tableName: "fragrances",
				//DeletedAt
				paranoid: false,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	static associate(db) {
		db.Fragrance.hasMany(db.Review);
	}
};

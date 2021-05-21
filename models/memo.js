const Sequelize = require("sequelize");

module.exports = class Memo extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				nick: {
					type: Sequelize.STRING(15),
					primaryKey: true,
				},
				kr_brand: {
					type: Sequelize.STRING(20),
					primaryKey: true,
				},
				kr_name: {
					type: Sequelize.STRING(45),
					primaryKey: true,
				},
				comment: {
					type: Sequelize.STRING(255),
				},
			},
			{
				sequelize,
				timestamps: true,
				underscored: false,
				modelName: "Memo",
				tableName: "memos",
				//DeletedAt
				paranoid: false,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	static associate(db) {
		db.Memo.belongsTo(db.Fragrance, { foreignKey: "kr_brand" });
		db.Memo.belongsTo(db.Fragrance, { foreignKey: "kr_name" });
		db.Memo.belongsTo(db.User, {
			foreignKey: {
				name: "nick",
			},
		});
	}
};

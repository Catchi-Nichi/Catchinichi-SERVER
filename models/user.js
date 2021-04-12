const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				email: {
					type: Sequelize.STRING(40),
					unique: true,
					primaryKey: true,
				},
				nick: {
					type: Sequelize.STRING(15),
					allowNull: true,
					unique: true,
				},
				//암호화(해쉬화)되면 길기 때문에 100글자
				password: {
					type: Sequelize.STRING(100),
					//sns 로그인은 비밀번호가 없을 수 있음
					allowNull: true,
				},
				phone: {
					type: Sequelize.STRING(13),
					allowNull: true,
				},
				age: {
					type: Sequelize.NUMBER,
				},
				gender: {
					type: Sequelize.ENUM("male", "female"),
				},
				provider: {
					type: Sequelize.STRING(10),
					allowNull: false,
					//일반 회원가입, SNS 회원가입X
					defaultValue: "local",
				},
				snsId: {
					type: Sequelize.STRING(30),
					allowNull: true,
				},
				token: {
					type: Sequelize.STRING(255),
				},
			},
			{
				sequelize,
				timestamps: true,
				underscored: false,
				modelName: "User",
				tableName: "users",
				//DeletedAt
				paranoid: true,
				//한글 지원
				charset: "utf8",
				collate: "utf8_general_ci",
			}
		);
	}

	// static associate(db) {
	// 	db.User.hasMany(db.Review);
	// }
};

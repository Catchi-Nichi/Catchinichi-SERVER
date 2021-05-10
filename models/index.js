const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const User = require("./user");
const Fragrance = require("./fragrance");
const Review = require("./review");
const Like = require("./like");
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Fragrance = Fragrance;
db.Review = Review;
db.Like = Like;

User.init(sequelize);
Fragrance.init(sequelize);
Review.init(sequelize);
Like.init(sequelize);

User.associate(db);
Fragrance.associate(db);
Review.associate(db);
Like.associate(db);

module.exports = db;

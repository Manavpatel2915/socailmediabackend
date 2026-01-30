const { Sequelize } = require('sequelize');
import UserModel from "../models/usermodel.sql";
import CommentModel from "../models/commentmodel.sql";
import PostModel from "../models/postmodel.sql";
import TokenModel from "../models/tokenmodel.sql";

const Databasename :string = "aribin";
const sequelize = new Sequelize('airbin', 'root', 'MANAVPATEL291', {
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
});

(async () => {
    try{
    await sequelize.authenticate();
    console.log(`Database connected ${Databasename}`);
  }catch(error){
    console.log(error);
  }
})();

const db:any ={};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User=UserModel(sequelize);
db.Post=PostModel(sequelize);
db.Comment=CommentModel(sequelize);
db.Token=TokenModel(sequelize);
// one to many 1user have many post 
db.User.hasMany(db.Post,{
    foreignKey: 'user_id',
});

db.Post.belongsTo(db.User,{
  foreignKey: 'user_id',
});

// one to many connect between post and comment 
db.Post.hasMany(db.Comment,{
    foreignKey: 'post_id',
});

db.Comment.belongsTo(db.Post,{
  foreignKey: 'post_id',
});

/// one to many connect between user and comment

db.User.hasMany(db.Comment, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
});

db.Comment.belongsTo(db.User, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
});


// sequelize.sync({ force: true });

export default db;

import {
  Model,
  Sequelize,
  DataTypes,
  DATE,
} from 'sequelize';

export default (sequelize: Sequelize
) => {
  class Post extends Model {
 
  declare post_id:number;
  declare title:string;
  declare content:string;
  declare image:string;
  declare like:number;
  declare user_id:number;
}

  Post.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "https://justdemo.jpeg",
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      user_id:{
        type :DataTypes.INTEGER,
        allowNull:false,
        
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'Post',
      modelName: 'Post',
    }
  );

  return Post;
};

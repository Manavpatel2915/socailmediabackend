import { Model,
         Sequelize,
          DataTypes,
        } from 'sequelize';
import type { Optional } from 'sequelize';

export default (sequelize: Sequelize
                ) => {
  class Post extends Model {}

  Post.init(
    {
       post_id :{
        type : DataTypes.INTEGER,
        unique : true,
        autoIncrement : true ,
        primaryKey : true,
       },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
        content:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:false,
      },
      image :{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue : "https://justdemo.jpeg",
      },
      like:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue :1,
      },
   
    },
    {
      sequelize,
      tableName: 'Post',
      modelName: 'Post',
    }
  );

  return Post;
};

import { Model,
         Sequelize,
          DataTypes  
        } from 'sequelize';

export default (sequelize: Sequelize
                ) => {
  class Comment extends Model {}

  Comment.init(
    {
       id :{
        type : DataTypes.INTEGER,
        unique : true,
        autoIncrement : true ,
        primaryKey : true,
       },
        Comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Comment',
      modelName: 'Comment',
    }
  );

  return Comment;
};

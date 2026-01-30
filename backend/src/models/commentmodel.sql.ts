import { Model, Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize) => {
  class Comment extends Model {
    declare id: number;
    declare Comment: string;
    declare user_id: number | null;
    declare post_id: number;
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      Comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },

      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "Comment",
      modelName: "Comment",
    }
  );

  return Comment;
};

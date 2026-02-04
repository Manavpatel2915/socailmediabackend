import { Model, Sequelize, DataTypes } from "sequelize";
import { Models } from "../../types/models.types";

export default (sequelize: Sequelize) => {
  class Comment extends Model {
    declare id: number;
    declare Comment: string;
    declare user_id: number | null;
    declare post_id: number;

    // Properly typed association method
    static associate(models: Models): void {
      // Comment -> Post (many-to-one)
      Comment.belongsTo(models.Post, {
        foreignKey: 'post_id',
        as: 'post',
        onDelete: 'CASCADE',
      });

      // Comment -> User (many-to-one, optional)
      Comment.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
          allowNull: true,
        },
        as: 'user',
        onDelete: 'SET NULL',
      });
    }
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
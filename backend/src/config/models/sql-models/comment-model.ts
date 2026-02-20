import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { Models } from "../../../types/models.types";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare comment: string;
  declare user_id: number | null;
  declare post_id: number;

  // If you have timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

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

export default (sequelize: Sequelize): typeof Comment => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comment: {
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
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
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
import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DbInterface } from "../../index";

export class Conversation extends Model<InferAttributes<Conversation>, InferCreationAttributes<Conversation>> {
  declare id: CreationOptional<number>;
  declare user_one_id: number;
  declare user_two_id: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static associate(models: DbInterface): void {
    Conversation.hasMany(models.Message, {
      foreignKey: "conversation_id",
      as: "messages",
      onDelete: "CASCADE",
    });

    Conversation.belongsTo(models.User, {
      foreignKey: "user_one_id",
      as: "userOne",
      onDelete: "CASCADE",
    });

    Conversation.belongsTo(models.User, {
      foreignKey: "user_two_id",
      as: "userTwo",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize): typeof Conversation => {
  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_one_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "user_id" },
      },
      user_two_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "user_id" },
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      underscored: true,
      tableName: "conversations",
      modelName: "Conversation", // ← db["Conversation"]
      indexes: [
        {
          unique: true,
          fields: ["user_one_id", "user_two_id"],
        },
      ],
    }
  );

  return Conversation;
};
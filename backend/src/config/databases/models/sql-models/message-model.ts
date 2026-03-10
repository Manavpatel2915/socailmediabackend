import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DbInterface } from "../../index";

export class Message extends Model <InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<number>;
  declare conversation_id: number;
  declare sender_id: number;
  declare message: string;
  declare is_read: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static associate(models: DbInterface): void {
    Message.belongsTo(models.Conversation, {
      foreignKey: "conversation_id",
      as: "conversation",
      onDelete: "CASCADE",
    });

    Message.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize): typeof Message => {
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "conversations", key: "id" },
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "user_id" },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      underscored: true,
      tableName: "messages",
      modelName: "Message", // ← db["Message"]
    }
  );

  return Message;
};
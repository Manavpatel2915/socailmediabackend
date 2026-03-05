import { Model, Sequelize, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
  declare notification_id: CreationOptional<number>;
  declare notification_owner_id: number;
  declare created_by_user_id: number;
  declare title: CreationOptional<string>;
  declare message: string;
  declare is_read: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export default (sequelize: Sequelize): typeof Notification => {
  Notification.init(
    {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notification_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      underscored: true,
      tableName: "Notification",
      modelName: "Notification",
    }
  );
  return Notification;
};
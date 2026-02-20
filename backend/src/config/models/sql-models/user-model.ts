import { Model, Sequelize, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import bcrypt from "bcrypt";
import { Models } from "../../../types/models.types";
import { ENUMS } from "../../../const/enum-model";
import { env } from "../../env.config";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<number>;
  declare user_name: string;
  declare email: string;
  declare password: string;
  declare role: typeof ENUMS.role[number];

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static associate(models: Models): void {
    User.hasMany(models.Post, {
      foreignKey: 'user_id',
      as: 'posts',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Comment, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
      as: 'comments',
      onDelete: 'SET NULL',
    });
  }
}

export default (sequelize: Sequelize): typeof User => {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...ENUMS.role),
        allowNull: false,
        defaultValue: ENUMS.role[1],
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
      tableName: "User",
      modelName: "User",
    }
  );

  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, env.JWT.SALT);
  });

  User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, env.JWT.SALT);
    }
  });

  return User;
};
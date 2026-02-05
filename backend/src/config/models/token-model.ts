import { Model, Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { Models } from "../../types/models.types";

export default (sequelize: Sequelize) => {
  class Token extends Model {
    declare user_id: number;
    declare user_name: string;
    declare email: string;
    declare password: string;
    declare role: "Admin" | "user";

  }

  Token.init(
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
        type: DataTypes.ENUM("Admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "token",
      modelName: "Token",
    }
  );

  Token.beforeCreate(async (user: Token) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  Token.beforeUpdate(async (user: Token) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return Token;
};
import { Model, Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize: Sequelize) => {
 class User extends Model {
  declare user_id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: "Admin" | "user";

}

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
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
      tableName: "user",
      modelName: "User",
    }
  );

  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

 
  User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};

import { Model, Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { Models } from "../../types/models.types";

export default (sequelize: Sequelize) => {
  class User extends Model {
    declare user_id: number;
    declare user_name: string;
    declare email: string;
    declare password: string;
    declare role: "Admin" | "user";

    // Properly typed association method
    static associate(models: Models): void {
      // User -> Posts (one-to-many)
      User.hasMany(models.Post, {
        foreignKey: 'user_id',
        as: 'posts',
        onDelete: 'CASCADE',
      });

      // User -> Comments (one-to-many, optional)
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
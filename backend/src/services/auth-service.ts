import db from "../config/databases/sql-connect";
import { errorhandler } from "../const/error-message";

const createUser = async (
  user_name: string,
  email: string,
  password: string,
  role: "Admin" | "User" = "User",
) => {
  try {
    const newUser = await db.User.create({
      user_name,
      email,
      password,
      role
    });
    return newUser.toJSON();
  } catch (error) {
    errorhandler(error, "not register problem with create user")
  }
};

const findUserByEmail = async (email: string) => {
  const user = await db.User.findOne({ where: { email }, raw: true });
  return user
};

const findUserById = async (userId: number) => {
  const user = await db.User.findByPk(userId);
  return user.toJSON();
};

export {
  createUser,
  findUserByEmail,
  findUserById,
}
import db from "../config/databases/sqldbconnnect";
import { errorhandler } from '../const/error-message';

const createUser = async (
  user_name: string,
  email: string,
  password: string,
  role: 'Admin' | 'User' = 'User',
) => {
  try {
    const newUser = await db.User.create({
      user_name,
      email,
      password,
      role
    });
    console.log("🚀 ~ createUser ~ newUser:", newUser)
    return newUser.toJSON();
  } catch (error) {
    console.log("🚀 ~ createUser ~ error:", error)
    errorhandler(error, "not register problem with create user")
  }
  console.log("🚀 ~ createUser ~ role:", role)
  console.log("🚀 ~ createUser ~ password:", password)
  console.log("🚀 ~ createUser ~ email:", email)
  console.log("🚀 ~ createUser ~ user_name:", user_name)
  console.log("hello");
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
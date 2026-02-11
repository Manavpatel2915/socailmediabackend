
import db from "../config/databases/sqldbconnnect";

const createUser = async (
  userName: string,
  email: string,
  password: string,
  role: "Admin" | "user"
) => {
  const newUser = await db.User.create({
    user_name: userName,
    email,
    password,
    role,
  });

  return newUser;
};

const findUserByEmail = async (email: string) => {
  return await db.User.findOne({ where: { email } });
};

const findUserById = async (userId: number) => {
  return await db.User.findByPk(userId);
};

export {
  createUser,
  findUserByEmail,
  findUserById,
}
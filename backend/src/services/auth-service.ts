
import db from "../config/databases/sqldbconnnect";

const createUser = async (
  userName: string,
  email: string,
  password: string,
  role:'Admin' | 'User'
) => {
  const newUser = await db.User.create({
    user_name: userName,
    email,
    password,
    role,
  });

  return newUser.toJSON();
};

const findUserByEmail = async (email: string) => {
  const user = await db.User.findOne({ where: { email } });
  return user.toJSON();
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
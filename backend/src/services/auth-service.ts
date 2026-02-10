import db from "../config/databases/sqldbconnnect";


 const createUser = async (
  user_name: string,
  email: string,
  password: string,
  role: "Admin" | "user"
) => {
  const user = await db.User.create({
    user_name,
    email,
    password: password,
    role,
  });

  return user;
};


 const findUserByEmail = async (email: string) => {
  return await db.User.findOne({ where: { email } });
};



 const findUserById = async (user_id: number) => {
  return await db.User.findByPk(user_id);
};



export {
    createUser,
    findUserByEmail,
    findUserById,

}
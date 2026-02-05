import db from "../config/sqldbconnnect";


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


 const deleteUserById = async (user_id: number) => {

  const comments = await db.Comment.findAll({ where: { user_id } });
  const commentIds = comments.map((c) => c.id);

  const deletedComments = await db.Comment.destroy({
    where: { id: commentIds },
  });

  
  const posts = await db.Post.findAll({ where: { user_id } });
  const postIds = posts.map((p) => p.post_id);

  const deletedPosts = await db.Post.destroy({
    where: { post_id: postIds },
  });

  
  const deletedUser = await db.User.destroy({ where: { user_id } });

  return { deletedUser, deletedPosts, deletedComments };
};



export{
    createUser,
    findUserByEmail,
    deleteUserById,
    findUserById,

}
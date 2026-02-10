

import db from "../config/databases/sqldbconnnect";

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

const findUser = async (userId: number) => {
  return await db.User.findByPk(userId);
}

const PostData = async (userId:number) => {
  const postdata = await db.Post.findAll({
    where:{
      user_id:userId
    }
  })
  return postdata;
}

const CommentData = async (userId:number) => {
  const commentdata = await db.Comment.findAll({
    where:{
    user_id:userId
    }
  })
  return commentdata;

}

const updateUser = async (
  existingUser: any,
  updateData: {
    user_name?: string;
    email?: string;
    password?: string;
  }
) => {

  const updatedUser = await existingUser.update(updateData);
  return updatedUser;
};

const useremail = async (
  email:string
) => {
  return email = await db.User.findOne({
    where:{
      email
    }
  });

}
export {
    deleteUserById,
    findUser,
    PostData,
    CommentData,
    updateUser,
    useremail,

}
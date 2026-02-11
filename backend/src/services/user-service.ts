
import db from "../config/databases/sqldbconnnect";

const deleteUser = async (userId: number) => {

  const userComments = await db.Comment.findAll({ where: { user_id: userId } });
  const commentIds = userComments.map((comment) => comment.id);

  const deletedCommentsCount = await db.Comment.destroy({
    where: { id: commentIds },
  });


  const userPosts = await db.Post.findAll({ where: { user_id: userId } });
  const postIds = userPosts.map((post) => post.post_id);

  const deletedPostsCount = await db.Post.destroy({
    where: { post_id: postIds },
  });


  const deletedUserCount = await db.User.destroy({ where: { user_id: userId } });

  return {
    deletedUser: deletedUserCount,
    deletedPosts: deletedPostsCount,
    deletedComments: deletedCommentsCount
  };
};

const getUserById = async (userId: number) => {
  return await db.User.findByPk(userId);
}

const getUserPosts = async (userId: number, offset: number, limit: number) => {
  const posts = await db.Post.findAll({
    where: {
      user_id: userId,
    },
    offset: offset,
    limit: limit
  });
  return posts;
}

const getUserComments = async (userId: number, offset: number, limit: number) => {
  const comments = await db.Comment.findAll({
    where: {
      user_id: userId
    },
    offset: offset,
    limit: limit
  });
  return comments;
}

const updateUserData = async (
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

const findUserByEmail = async (email: string) => {
  return await db.User.findOne({
    where: {
      email
    }
  });
}

export {
  deleteUser,
  getUserById,
  getUserPosts,
  getUserComments,
  updateUserData,
  findUserByEmail,
}
import { User } from '../config/models/sql-models/user-model';
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
  return await db.User.findByPk(userId, {
    raw: true,
    attributes: { exclude: ['password'] }
  }) ;
}

const updateUserData = async (
  existingUser: User,
  updateData: {
    user_name?: string;
    email?: string;
    password?: string;
  }
) => {
  await existingUser.update(updateData);
  return existingUser.toJSON();
};

const findUserByEmail = async (email: string) => {
  return await db.User.findOne({
    where: {
      email
    },
    raw: true,
  });
}

const allUsers = async (offset: number, limit: number) => {
  return await db.User.findAll({
    offset: offset,
    limit: limit,
    raw: true
  });
}

export {
  deleteUser,
  getUserById,
  updateUserData,
  findUserByEmail,
  allUsers
}
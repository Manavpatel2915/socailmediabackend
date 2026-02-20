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
    attributes: { exclude: ['password', 'user_id'] }
  }) ;
}

const updateUserData = async (
  existingUser: User,
  updateData: Partial<User>
) => {
  await existingUser.update(updateData);
  const userData = existingUser.toJSON() as Record<string, unknown>;
  delete userData.password;
  return userData;
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
    attributes: {
      exclude: ['password'],
      include: [
        [db.sequelize.fn('COUNT', db.sequelize.col('posts.post_id')), 'post_count']
      ]
    },
    include: [
      {
        model: db.Post,
        as: 'posts',
        attributes: [],
      }
    ],
    group: ['User.user_id'],
    subQuery: false,
  });
}

export {
  deleteUser,
  getUserById,
  updateUserData,
  findUserByEmail,
  allUsers
}
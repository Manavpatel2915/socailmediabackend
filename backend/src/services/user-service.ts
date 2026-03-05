import { User } from '../config/databases/models/sql-models/user-model';
import db from "../config/databases/sql-connect";

const deleteUserData = async (userId: number) => {
  const deletedCommentsCount = await db.Comment.destroy({
    where: { user_id: userId },
  });

  const deletedPostsCount = await db.Post.destroy({
    where: { user_id: userId },
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
    raw: false
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
  deleteUserData,
  getUserById,
  updateUserData,
  findUserByEmail,
  allUsers
}
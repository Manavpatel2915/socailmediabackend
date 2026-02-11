
import db from "../config/databases/sqldbconnnect";

const createPost = async (
  title: string,
  content: string,
  image: string,
  userId: number,
) => {
  const post = await db.Post.create({
    title,
    content,
    image,
    user_id: userId,
  });
  return post;
};

const getPostById = async (postId: number) => {
  const post = await db.Post.findOne({
    where: {
      post_id: postId,
    },
    include: [
      {
        model: db.User,
        attributes: ["user_name"],
        as: "user"
      },
      {
        model: db.Comment,
        attributes: ["Comment"],
        as: "comments"
      }
    ],
  });
  return post;
}

const findPostById = async (postId: number) => {
  return await db.Post.findByPk(postId);
}

const deletePostWithComments = async (postId: number) => {

  const postComments = await db.Comment.findAll({
    where: {
      post_id: postId
    }
  });

  const commentIds = postComments.map(comment => comment.id);

  // Delete all comments
  const deletedCommentsCount = await db.Comment.destroy({
    where: {
      id: commentIds
    }
  });

  // Delete the post
  const deletedPostCount = await db.Post.destroy({
    where: {
      post_id: postId
    }
  });

  return {
    deletedPost: deletedPostCount,
    deletedComments: deletedCommentsCount
  };
}

const updatePostData = async (
  existingPost: any,
  updateData: {
    title?: string;
    content?: string;
    image?: string;
  }
) => {
  return await existingPost.update(updateData);
}

export {
  createPost,
  getPostById,
  findPostById,
  deletePostWithComments,
  updatePostData,
}
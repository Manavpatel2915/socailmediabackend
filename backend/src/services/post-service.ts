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
  return post.toJSON();
};

// const getPostByIdWithUserAndComment = async (postId: number) => {
//   const post = await db.Post.findOne({
//     where: {
//       post_id: postId,
//     },
//     include: [
//       {
//         model: db.User,
//         attributes: ["user_name"],
//         as: "user"
//       },
//       {
//         model: db.Comment,
//         attributes: ["Comment"],
//         as: "comments"
//       }
//     ],
//   });
//   return post;
// }

const findPostById = async (postId: number) => {
  return await db.Post.findByPk(postId, { raw: true });
}

const deletePostWithComments = async (postId: number) => {

  const postComments = await db.Comment.findAll({
    where: {
      post_id: postId
    }
  });

  const commentIds = postComments.map(comment => comment.id);

  const deletedCommentsCount = await db.Comment.destroy({
    where: {
      id: commentIds
    }
  });

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

const findPostsAndCommentByUserId = async (
  userId: number,
  postOffset: number,
  postLimit: number,
  commentLimit: number,
  commentOffset: number,
) => {

  const posts = await db.Post.findAll({
    where: { user_id: userId },
    offset: postOffset,
    limit: postLimit,
    raw: true
  });

  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await db.Comment.findAll({
        where: { post_id: post.post_id },
        offset: commentOffset,
        limit: commentLimit,
        raw: true
      });

      return {
        ...post,
        comments,
      };
    })
  );

  return postsWithComments
};

export {
  createPost,
  // getPostByIdWithUserAndComment,
  findPostById,
  deletePostWithComments,
  updatePostData,
  findPostsAndCommentByUserId
}
import db from "../config/databases/sqldbconnnect";
import { postdatwithUser } from "../types/type"
import { Post } from "../config/models/sql-models/post-model"
import { orderBytype } from "../types/type";

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

const findPostByIdWithUsername = async (postId: number) => {
  const postdata = await db.Post.findByPk(postId, {
    raw: true,
    nest: true,
    attributes: {
      exclude: ['post_id', 'user_id'],
    },
    include: {
      model: db.User,
      attributes: ["user_name"],
      as: "user"
    }
  });
  if (!postdata) return null;
  const post = postdata as unknown as postdatwithUser;
  return {
    ...post,
    user_name: post.user.user_name,
    user: undefined
  };
};

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
  existingPost: Post,
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
  comment: boolean,
) => {
  const posts = await db.Post.findAll({
    where: { user_id: userId },
    offset: postOffset,
    limit: postLimit,
    attributes: {
      exclude: ['user_id']
    },
    raw: true
  });

  if (!comment) return posts;

  const postsWithComments = await Promise.all(
    posts.map(async (post: Post) => {
      const comments = await db.Comment.findAll({
        where: { post_id: post.post_id },
        attributes: {
          exclude: ['id', 'post_id']
        },
        raw: true
      });
      return {
        ...post,
        comments,
      };
    })
  );

  return postsWithComments;
};

const postOrderByLeastestCreate = async (
  postLimit: number,
  postOffset: number,
  orderBy: string
) => {
  const order: orderBytype = orderBy === 'ASC' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']];
  const postdata = await db.Post.findAll({
    order: order,
    attributes: {
      exclude: ['post_id', 'user_id'],
    },
    include: [
      {
        model: db.User,
        attributes: ["user_name"],
        as: "user"
      }
    ],
    offset: postOffset,
    limit: postLimit,
    raw: true,
    nest: true,
  });

  return (postdata as unknown as postdatwithUser[]).map((post: postdatwithUser) => ({
    ...post,
    user_name: post.user.user_name,
    user: undefined
  }));
}

const findPostById = async (
  postId: number
) => {
  const postdata = await db.Post.findByPk(postId, {
    raw: true,
  });
  return postdata;
}

export {
  createPost,
  // getPostByIdWithUserAndComment,
  findPostByIdWithUsername,
  deletePostWithComments,
  updatePostData,
  findPostsAndCommentByUserId,
  postOrderByLeastestCreate,
  findPostById,
}
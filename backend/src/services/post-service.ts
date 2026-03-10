import db from "../config/databases/sql-connect";
import { postDataWithUser } from "../types/type"
import { Post } from "../config/databases/models/sql-models/post-model"
import { orderByType, filterOptions } from "../types/type";
import { Op, WhereOptions } from "sequelize";

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
      exclude: ["post_id", "user_id"],
    },
    include: {
      model: db.User,
      attributes: ["user_name"],
      as: "user"
    }
  });
  if (!postdata) return null;
  const post = postdata as unknown as postDataWithUser;
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

  await existingPost.update(updateData);
  return existingPost.toJSON();
  //   await existingComment.update({ comment: commentText });
  // return existingComment.toJSON();
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
      exclude: ["user_id"]
    },
    raw: true
  });

  if (comment) return posts;

  const postsWithComments = await Promise.all(
    posts.map(async (post: Post) => {
      const comments = await db.Comment.findAll({
        where: { post_id: post.post_id },
        attributes: {
          exclude: ["id", "post_id"]
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

const getAllPost = async (
  postLimit: number,
  postOffset: number,
  orderBy: string,
  filter: filterOptions
) => {
  const order: orderByType = orderBy === "ASC" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];
  const where: WhereOptions = {};
  if (filter?.likecount) {
    const { maxlike, minlike } = filter.likecount;
    if (maxlike && minlike) {

      where.like = { [Op.between]: [Number(minlike), Number(maxlike)] };
    } else if (maxlike) {

      where.like = { [Op.lte]: Number(maxlike) };
    } else if (minlike) {

      where.like = { [Op.gte]: Number(minlike) };
    }
  }
  const postdata = await db.Post.findAll({
    where,
    attributes: {
      exclude: ["post_id", "user_id"],
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
    order: order,
    raw: true,
    nest: true,
  });

  return (postdata as unknown as postDataWithUser[]).map((post: postDataWithUser) => ({
    ...post,
    user_name: post.user.user_name,
    user: undefined
  }));
}

const findPostById = async (
  postId: number
) => {
  const postdata = await db.Post.findByPk(postId);
  return postdata;
}

const getAllPostByUserId = async (
  userId: number
) => {
  const allpost = await db.Post.findAll({
    where: {
      user_id: userId
    },
    attributes: {
      exclude: ["post_id", "user_id" ]
    }
  });
  return allpost;
}

const mostLikedUser = async (
  maxlike: number,
  minlike: number
) => {
  const where: WhereOptions = {};
  if (maxlike && minlike) {

    where.like = { [Op.between]: [Number(minlike), Number(maxlike)] };
  } else if (maxlike) {

    where.like = { [Op.lte]: Number(maxlike) };
  } else if (minlike) {

    where.like = { [Op.gte]: Number(minlike) };
  }
  const users = await db.Post.findAll({
    where,
    include: [
      {
        model: db.User,
        attributes: ["user_name"],
        as: "user"
      }
    ]
  });
  console.log("🚀 ~ mostLikedUser ~ users:", users)
  return users;
}

export {
  createPost,
  // getPostByIdWithUserAndComment,
  findPostByIdWithUsername,
  deletePostWithComments,
  updatePostData,
  findPostsAndCommentByUserId,
  getAllPost,
  findPostById,
  getAllPostByUserId,
  mostLikedUser,
}
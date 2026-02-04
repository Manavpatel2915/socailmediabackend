import db from "../config/sqldbconnnect";

const createPost = async(
    title:string,
    content:string,
    image:string,
    user_id:number,
)=>{
    const post = await db.Post.create({
    title,
    content,
    image,
    user_id,
  });
  return post;
};

const PostData =async(
    postId
)=>{
    const data = await db.Post.findOne({
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
  return data;
}

const findPostById =async(
    postId
)=>{
    return await db.Post.findByPk(postId);
}

const deletePost =async(
  postId
)=>{

   const comments = await db.Comment.findAll({
    where: {
      post_id: postId
    }
  });
  const commentId= comments.map(item => item.id);
  const deteledComment=await db.Comment.destroy({
    where: {
      id: commentId
    }
  });
  const deletePost = await db.Post.destroy({
    where: {
      post_id: postId
    }
  });
  return {deletePost,deteledComment};
}

const updatePost = async(
    data,
    Post
)=>{
  return  await Post.update(data);
}
export {
    createPost,
    PostData,
    findPostById,
    deletePost,
    updatePost,
}
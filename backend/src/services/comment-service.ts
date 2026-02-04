import db from "../config/sqldbconnnect";


const findCommentById = async(
    commentId
)=>{
    const comment= await db.Comment.findByPk(commentId);
  return comment;

}

const createComment = async(
    postId,
    user,
    data
)=>{
    
    const commentData = await db.Comment.create({
      data,
      post_id: postId,
      user_id: user ? user.user_id : null, 
    });
    return commentData
}

const updateComment= async(
    existingComment,
    comment
)=>{
 return await existingComment.update({ Comment: comment });
}

const deletedComment = async(
  commentId
)=>{

   const deteledcomment =await db.Comment.destroy({
  where: {
    id: commentId
  }
});
return deteledcomment;
}
export{
    findCommentById,
    createComment,
    updateComment,
    deletedComment,

}
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get actual user_ids and post_ids from the database
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM user ORDER BY user_id',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const posts = await queryInterface.sequelize.query(
      'SELECT post_id FROM post ORDER BY post_id',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0) {
      throw new Error('No users found. Please run users seed first.');
    }
    
    if (posts.length === 0) {
      throw new Error('No posts found. Please run posts seed first.');
    }

    const userIds = users.map((u) => u.user_id);
    const postIds = posts.map((p) => p.post_id);
    const comments = [];
    let commentId = 1;

    for (let i = 0; i < postIds.length; i++){
      const postId = postIds[i];
      comments.push(
        {
          id: commentId++,
          comment: `Great post ${postId}!`,
          user_id: userIds[i % userIds.length],
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: commentId++,
          comment: `Very informative post ${postId}.`,
          user_id: userIds[(i + 1) % userIds.length],
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    // Check if comments already exist
    const existingComments = await queryInterface.sequelize.query(
      'SELECT id FROM comment',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (existingComments.length === 0) {
      await queryInterface.bulkInsert('comment', comments);
    } else {
      console.log('Comments already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comment', null, {});
  },
};

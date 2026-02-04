'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const comments = [];
    let commentId = 1;

    for (let postId = 1; postId <= 10; postId++) {
      comments.push(
        {
          id: commentId++,
          comment: `Great post ${postId}!`,
          user_id: ((postId - 1) % 8) + 1,
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: commentId++,
          comment: `Very informative post ${postId}.`,
          user_id: (postId % 8) + 1 <= 8 ? (postId % 8) + 1 : 1,
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    await queryInterface.bulkInsert('comment', comments);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comment', null, {});
  },
};

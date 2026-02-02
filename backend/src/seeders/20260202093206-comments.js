'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const comments = [];

    let commentId = 1;

    for (let postId = 1; postId <= 10; postId++) {
      // 2 comments per post = 20 total
      comments.push(
        {
          id: commentId++,
          Comment: `Great post ${postId}!`,
          user_id: ((postId - 1) % 6) + 1, // rotate users 1–6
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: commentId++,
          Comment: `Very informative post ${postId}`,
          user_id: (postId % 6) + 1,
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    await queryInterface.bulkInsert('Comment', comments);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Comment', null, {});
  },
};

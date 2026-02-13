'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ── Fetch users and posts ────────────────────────────────────────────────
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM user ORDER BY user_id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const posts = await queryInterface.sequelize.query(
      'SELECT post_id FROM post ORDER BY post_id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error('❌ No users found. Please run the users seeder first.');
    }
    if (posts.length === 0) {
      throw new Error('❌ No posts found. Please run the posts seeder first.');
    }

    const userIds = users.map((u) => u.user_id);
    const postIds = posts.map((p) => p.post_id);

    // ── Comment templates ───────────────────────────────────────────────────
    // 10 comment texts per post:
    //   • Comments at index 0–5  → have a user_id  (authenticated users)
    //   • Comments at index 6–9  → user_id is NULL  (anonymous / guest)
    const commentTemplates = [
      // ── Authenticated comments (indices 0–5) ───────────────────────────
      (postId) => `Great post #${postId}! Really enjoyed reading this.`,
      (postId) => `Very informative content in post #${postId}. Thanks for sharing!`,
      (postId) => `Post #${postId} gave me a totally new perspective. Loved it!`,
      (postId) => `Excellent write-up on post #${postId}. Keep it up!`,
      (postId) => `I completely agree with what's said in post #${postId}.`,
      (postId) => `Post #${postId} is one of the best I've read this week!`,

      // ── Anonymous comments (indices 6–9, user_id = NULL) ───────────────
      (postId) => `This post #${postId} is really helpful! — Anonymous`,
      (postId) => `Interesting read, post #${postId}. Shared with my friends.`,
      (postId) => `Thanks for post #${postId}! Came here from a Google search.`,
      (postId) => `No account, just wanted to say post #${postId} was awesome!`,
    ];

    const comments = [];
    let commentId = 1;

    for (let i = 0; i < postIds.length; i++) {
      const postId = postIds[i];

      for (let c = 0; c < 10; c++) {
        const isAnonymous = c >= 6; // last 4 comments (index 6,7,8,9) are anonymous

        comments.push({
          id: commentId,
          comment: commentTemplates[c](postId),
          // Authenticated: rotate through available users; Anonymous: NULL
          user_id: isAnonymous
            ? null
            : userIds[(i + c) % userIds.length],
          post_id: postId,
          created_at: new Date(),
          updated_at: new Date(),
        });

        commentId++;
      }
    }

    // ── Check if comments already exist ────────────────────────────────────
    const existingComments = await queryInterface.sequelize.query(
      'SELECT id FROM comment',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingComments.length === 0) {
      await queryInterface.bulkInsert('comment', comments);

      const totalPosts     = postIds.length;
      const totalComments  = comments.length;
      const anonComments   = comments.filter((c) => c.user_id === null).length;
      const authComments   = totalComments - anonComments;

      console.log(
        `✅ Seeded ${totalComments} comments across ${totalPosts} posts:\n` +
        `   • ${authComments} authenticated comments (with user_id)\n` +
        `   • ${anonComments} anonymous comments   (user_id = NULL)`
      );
    } else {
      console.log('⚠️  Comments already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comment', null, {});
  },
};
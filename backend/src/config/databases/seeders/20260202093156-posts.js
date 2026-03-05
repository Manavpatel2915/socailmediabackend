'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM user ORDER BY user_id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error('❌ No users found. Please run the users seeder first.');
    }

    const regularUsers = users.slice(2);
    const firstTenUsers = regularUsers.slice(0, 10);
    const lastEightUsers = regularUsers.slice(10);

    const posts = [];
    let postId = 1;

    for (const user of firstTenUsers) {
      for (let p = 1; p <= 10; p++) {
        posts.push({
          post_id: postId,
          title: `Post ${postId} by User ${user.user_id}`,
          content: `This is the content of post ${postId} written by user ${user.user_id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          image: 'https://justdemo.jpeg',
          like: postId * 3,
          user_id: user.user_id,
          created_at: new Date(Date.now() - postId * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - postId * 60 * 60 * 1000),
        });
        postId++;
      }
    }

    for (const user of lastEightUsers) {
      for (let p = 1; p <= 5; p++) {
        posts.push({
          post_id: postId,
          title: `Post ${postId} by User ${user.user_id}`,
          content: `This is the content of post ${postId} written by user ${user.user_id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          image: 'https://justdemo.jpeg',
          like: postId * 2,
          user_id: user.user_id,
          created_at: new Date(Date.now() - postId * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - postId * 60 * 60 * 1000),
        });
        postId++;
      }
    }

    const existingPosts = await queryInterface.sequelize.query(
      'SELECT post_id FROM post',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingPosts.length === 0) {
      await queryInterface.bulkInsert('post', posts);
      console.log(
        `✅ Seeded ${posts.length} posts:` +
        ` ${firstTenUsers.length * 10} posts for first 10 users,` +
        ` ${lastEightUsers.length * 5} posts for last 8 users.`
      );
    } else {
      console.log('⚠️  Posts already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('post', null, {});
  },
};
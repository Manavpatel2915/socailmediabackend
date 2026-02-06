'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get actual user_ids from the database
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM user ORDER BY user_id',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0) {
      throw new Error('No users found. Please run users seed first.');
    }

    const userIds = users.map((u) => u.user_id);
    const posts = [];

    for (let i = 1; i <= 10; i++) {
      posts.push({
        post_id: i,
        title: `Post Title ${i}`,
        content: `This is the content of post ${i}`,
        image: 'https://justdemo.jpeg',
        like: i * 3,
        user_id: userIds[((i - 1) % userIds.length)], // rotate through available users
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Check if posts already exist
    const existingPosts = await queryInterface.sequelize.query(
      'SELECT post_id FROM post',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (existingPosts.length === 0) {
      await queryInterface.bulkInsert('post', posts);
    } else {
      console.log('Posts already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('post', null, {});
  },
};

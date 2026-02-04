'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const posts = [];

    for (let i = 1; i <= 10; i++) {
      posts.push({
        post_id: i,
        title: `Post Title ${i}`,
        content: `This is the content of post ${i}`,
        image: 'https://justdemo.jpeg',
        like: i * 3,
        user_id: ((i - 1) % 8) + 1, // rotate users 1–8
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('post', posts);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('post', null, {});
  },
};

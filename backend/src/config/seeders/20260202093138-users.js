'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        user_name: 'admin_user',
        email: 'admin@gmail.com',
        password: 'AdminPass123',
        role: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'john_doe',
        email: 'john@gmail.com',
        password: 'password123',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'alice_w',
        email: 'alice@gmail.com',
        password: 'SecurePass99',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'bob_smith',
        email: 'bob@gmail.com',
        password: 'MyPassword88',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'emma_j',
        email: 'emma@gmail.com',
        password: 'EmmaPass123',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'mike_t',
        email: 'mike@gmail.com',
        password: 'MikePass456',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'sara_k',
        email: 'sara@gmail.com',
        password: 'SaraSecure77',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'david_l',
        email: 'david@gmail.com',
        password: 'DavidPass321',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user', null, {});
  },
};

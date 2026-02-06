'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const users = [
      {
        user_name: 'admin_user',
        email: 'admin@gmail.com',
        password: 'AdminPass123',
        role: 'Admin',
      },
      {
        user_name: 'john_doe',
        email: 'john@gmail.com',
        password: 'password123',
        role: 'user',
      },
      {
        user_name: 'alice_w',
        email: 'alice@gmail.com',
        password: 'SecurePass99',
        role: 'user',
      },
      {
        user_name: 'bob_smith',
        email: 'bob@gmail.com',
        password: 'MyPassword88',
        role: 'user',
      },
      {
        user_name: 'emma_j',
        email: 'emma@gmail.com',
        password: 'EmmaPass123',
        role: 'user',
      },
      {
        user_name: 'mike_t',
        email: 'mike@gmail.com',
        password: 'MikePass456',
        role: 'user',
      },
      {
        user_name: 'sara_k',
        email: 'sara@gmail.com',
        password: 'SaraSecure77',
        role: 'user',
      },
      {
        user_name: 'david_l',
        email: 'david@gmail.com',
        password: 'DavidPass321',
        role: 'user',
      },
    ];

    // Hash all passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, saltRounds),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    // Check if users already exist
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT email FROM user',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (existingUsers.length === 0) {
      await queryInterface.bulkInsert('user', hashedUsers);
    } else {
      console.log('Users already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user', null, {});
  },
};

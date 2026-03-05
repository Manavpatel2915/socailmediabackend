'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcrypt');
/* eslint-enable @typescript-eslint/no-require-imports */

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const users = [
      // ── 2 Admins ────────────────────────────────────────────────────────
      {
        user_name: 'admin_super',
        email: 'admin.super@gmail.com',
        password: 'AdminSuper@123',
        role: 'Admin',
      },
      {
        user_name: 'admin_manager',
        email: 'admin.manager@gmail.com',
        password: 'AdminManager@456',
        role: 'Admin',
      },

      // ── 18 Regular Users ─────────────────────────────────────────────────
      // First 10 users — will each get 10 posts
      {
        user_name: 'john_doe',
        email: 'john.doe@gmail.com',
        password: 'JohnPass@123',
        role: 'user',
      },
      {
        user_name: 'alice_walker',
        email: 'alice.walker@gmail.com',
        password: 'AlicePass@99',
        role: 'user',
      },
      {
        user_name: 'bob_smith',
        email: 'bob.smith@gmail.com',
        password: 'BobPass@88',
        role: 'user',
      },
      {
        user_name: 'emma_jones',
        email: 'emma.jones@gmail.com',
        password: 'EmmaPass@123',
        role: 'user',
      },
      {
        user_name: 'mike_taylor',
        email: 'mike.taylor@gmail.com',
        password: 'MikePass@456',
        role: 'user',
      },
      {
        user_name: 'sara_king',
        email: 'sara.king@gmail.com',
        password: 'SaraPass@77',
        role: 'user',
      },
      {
        user_name: 'david_lee',
        email: 'david.lee@gmail.com',
        password: 'DavidPass@321',
        role: 'user',
      },
      {
        user_name: 'olivia_brown',
        email: 'olivia.brown@gmail.com',
        password: 'OliviaPass@222',
        role: 'user',
      },
      {
        user_name: 'james_wilson',
        email: 'james.wilson@gmail.com',
        password: 'JamesPass@555',
        role: 'user',
      },
      {
        user_name: 'sophia_martin',
        email: 'sophia.martin@gmail.com',
        password: 'SophiaPass@888',
        role: 'user',
      },

      // Last 8 users — will each get 5 posts
      {
        user_name: 'liam_anderson',
        email: 'liam.anderson@gmail.com',
        password: 'LiamPass@111',
        role: 'user',
      },
      {
        user_name: 'mia_thomas',
        email: 'mia.thomas@gmail.com',
        password: 'MiaPass@222',
        role: 'user',
      },
      {
        user_name: 'noah_jackson',
        email: 'noah.jackson@gmail.com',
        password: 'NoahPass@333',
        role: 'user',
      },
      {
        user_name: 'isabella_white',
        email: 'isabella.white@gmail.com',
        password: 'IsabellaPass@444',
        role: 'user',
      },
      {
        user_name: 'lucas_harris',
        email: 'lucas.harris@gmail.com',
        password: 'LucasPass@555',
        role: 'user',
      },
      {
        user_name: 'ava_clark',
        email: 'ava.clark@gmail.com',
        password: 'AvaPass@666',
        role: 'user',
      },
      {
        user_name: 'ethan_lewis',
        email: 'ethan.lewis@gmail.com',
        password: 'EthanPass@777',
        role: 'user',
      },
      {
        user_name: 'charlotte_hall',
        email: 'charlotte.hall@gmail.com',
        password: 'CharlottePass@888',
        role: 'user',
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, saltRounds),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    const existingUsers = await queryInterface.sequelize.query(
      'SELECT email FROM user',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUsers.length === 0) {
      await queryInterface.bulkInsert('user', hashedUsers);
      console.log('Seeded 20 users (2 Admin + 18 Regular).');
    } else {
      console.log('Users already exist, skipping seed.');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user', null, {});
  },
};
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('1234567890', 10);

    await queryInterface.bulkInsert('user', [
      {
        user_id: 1,
        user_name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        user_name: 'john',
        email: 'john@gmail.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        user_name: 'alice',
        email: 'alice@gmail.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4,
        user_name: 'bob',
        email: 'bob@gmail.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 5,
        user_name: 'emma',
        email: 'emma@gmail.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 6,
        user_name: 'mike',
        email: 'mike@gmail.com',
        password: hashedPassword,
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

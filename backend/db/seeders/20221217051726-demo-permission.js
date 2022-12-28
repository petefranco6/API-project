'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Permissions";
    await queryInterface.bulkInsert(options, [
      {
        roleId: 2,
        name: "review_all",
        description: "access to all permissions for reviews"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Permissions"
    await queryInterface.bulkDelete(options)
  }
};

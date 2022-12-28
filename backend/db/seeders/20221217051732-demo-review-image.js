'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "ReviewImages"
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "review image url 1"
      },
      {
        reviewId: 2,
        url: "review image url 2"
      },
      {
        reviewId: 2,
        url: "review image url 3"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages"
    await queryInterface.bulkDelete(options)
  }
};

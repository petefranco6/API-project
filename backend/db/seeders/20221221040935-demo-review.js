'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = "Reviews";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review: "this place is doo doo! dont bother!",
        stars: 1,
      },
      {
        spotId: 2,
        userId: 1,
        review: "not bad, won't go again",
        stars: 2,
      },
      {
        spotId: 3,
        userId: 2,
        review: "This place sucks! JK",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: "I disagree, it is not that bad!",
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: "I loved it!!",
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: "pretty good!",
        stars: 3
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options)
  }
};

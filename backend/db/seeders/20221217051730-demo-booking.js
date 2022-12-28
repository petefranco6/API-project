"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings"
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId:2,
        startDate: "2022-12-28",
        endDate: "2022-12-29"
      },
      {
        spotId: 3,
        userId:1,
        startDate: "2022-12-28",
        endDate: "2022-12-29"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2022-12-29",
        endDate: "2022,12,31"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2022-12-24",
        endDate: "2022,12,25"
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings"
    await queryInterface.bulkDelete(options)
  },
};

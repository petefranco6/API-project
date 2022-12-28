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
   options.tableName = "Spots";
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: "1234 Red street",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 12.1,
      lng: 12.1,
      name: "Cool House",
      description: "This is a cool house!",
      price: 100
    },
    {
      ownerId: 2,
      address: "1234 Blue avenue",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 20.1,
      lng: 20.1,
      name: "Cool House",
      description: "This is a cool house!",
      price: 200
    },
    {
      ownerId: 3,
      address: "1234 Green Road",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 100.1,
      lng: 100.1,
      name: "Cool House",
      description: "This is a REALLY cool house!",
      price: 2000
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['1234 Red street','1234 Blue avenue','1234 Green Road']}
    }, {})
  }
};

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
      address: "12 Red street",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 12.1,
      lng: 12.1,
      name: "Cool House1",
      description: "This is a cool house!",
      price: 1006
    },
    {
      ownerId: 1,
      address: "123 Red street",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 12.1,
      lng: 12.1,
      name: "Cool House2",
      description: "This is a cool house!",
      price: 1007
    },
    {
      ownerId: 1,
      address: "1234 Red street",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 12.1,
      lng: 12.1,
      name: "Cool House3",
      description: "This is a cool house!",
      price: 1000
    },
    {
      ownerId: 2,
      address: "12 Blue avenue",
      city: "Austin",
      state: "Texas",
      country: "United States",
      lat: 20.1,
      lng: 20.1,
      name: "meh House 1",
      description: "This is a meh house!",
      price: 200
    },
    {
      ownerId: 2,
      address: "123 Blue avenue",
      city: "Austin",
      state: "Texas",
      country: "United States",
      lat: 20.1,
      lng: 20.1,
      name: "meh House",
      description: "This is a meh house!",
      price: 20
    },
    {
      ownerId: 2,
      address: "1234 Blue avenue",
      city: "Houston",
      state: "Texas",
      country: "United States",
      lat: 20.1,
      lng: 20.1,
      name: "meh House",
      description: "This is a meh house!",
      price: 2
    },
    {
      ownerId: 3,
      address: "12 Green Road",
      city: "Dallas",
      state: "Texas",
      country: "United States",
      lat: 100.1,
      lng: 100.1,
      name: "Cool House",
      description: "This is a REALLY cool house!",
      price: 20
    },
    {
      ownerId: 3,
      address: "123 Green Road",
      city: "Dallas",
      state: "Texas",
      country: "United States",
      lat: 100.1,
      lng: 100.1,
      name: "Cool House",
      description: "This is a REALLY cool house!",
      price: 200
    },
    {
      ownerId: 3,
      address: "1234 Green Road",
      city: "Dallas",
      state: "Texas",
      country: "United States",
      lat: 100.1,
      lng: 100.1,
      name: "nice House",
      description: "This is a REALLY nice house!",
      price: 20000
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

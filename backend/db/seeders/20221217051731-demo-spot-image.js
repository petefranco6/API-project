'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = "SpotImages"
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 1,
      url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 1,
      url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 1,
      url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1600",
      preview: true
    },
    {
      spotId: 2,
      url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 2,
      url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 2,
      url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 2,
      url: 'https://images.pexels.com/photos/276514/pexels-photo-276514.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages"
    await queryInterface.bulkDelete(options)
  }
};

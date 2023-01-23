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
    {
      spotId: 4,
      url: 'https://images.pexels.com/photos/259685/pexels-photo-259685.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://images.pexels.com/photos/20943/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://images.pexels.com/photos/242827/pexels-photo-242827.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://images.pexels.com/photos/2104151/pexels-photo-2104151.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 6,
      url: 'https://images.pexels.com/photos/877971/pexels-photo-877971.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: false
    },
    {
      spotId: 7,
      url: 'https://images.pexels.com/photos/262405/pexels-photo-262405.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 8,
      url: 'https://images.pexels.com/photos/463996/pexels-photo-463996.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
    {
      spotId: 9,
      url: 'https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg?auto=compress&cs=tinysrgb&w=1600',
      preview: true
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages"
    await queryInterface.bulkDelete(options)
  }
};

const express = require("express");
const { Spot, SpotImage, Review, Sequelize } = require("../../db/models");

const router = express.Router();

router.get("/", async (req, res) => {

  let allSpots = await Spot.findAll({
    attributes: {
      include: [
        [Sequelize.col("SpotImages.url"), "previewImage"],
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"]

     ]
    },
    include: [
      {
        model: SpotImage,
        attributes:[]
      },
      {
        model: Review,
        attributes:[]
      }
    ],
    group: ["Spot.id"]
  });

  return res.json({
    Spots: allSpots,

  });
});

module.exports = router;

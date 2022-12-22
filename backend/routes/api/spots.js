const express = require("express");
const { Spot, SpotImage, Review, User, Sequelize } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator")
const { handleValidationErrors } = require("../../utils/validation")

const router = express.Router();

const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Latitude is not valid.'),
  check('lng')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage('Longitude is not valid.'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .isAlpha()
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required.'),
  handleValidationErrors
];

//get all spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
    attributes: {
      include: [
        [Sequelize.col("SpotImages.url"), "previewImage"],
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: SpotImage,
        attributes: [],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
    group: ["Spot.id"],
  });

  return res.json({
    Spots: allSpots,
  });
});

//find details of spot by id
router.get("/:spotId", async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    attributes: {
      include: [
        [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgStarRating"],
      ],
    },
    where: {
      id: spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Owner",
      },
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!spot.id) {
    const err = new Error("Spot Couldn't be found");
    err.status = 404;
    return next(err);
  }

  return res.json(spot);
});

//create a spot
router.post("/", requireAuth, validateCreateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, descripton, price } =
    req.body;

  const {user} = req;

  const spot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    descripton,
    price,
  });
  return res.status(201).json(spot);
});

module.exports = router;

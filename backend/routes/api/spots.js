const express = require("express");
const {
  Spot,
  SpotImage,
  Review,
  User,
  Sequelize,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required."),
  check("state").exists({ checkFalsy: true }).withMessage("State is required."),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required."),
  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Latitude is not valid."),
  check("lng")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Longitude is not valid."),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .isAlpha()
    .withMessage("Name must be less than 50 characters."),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required."),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required."),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateBooking = [
  check("startDate")
    .exists({checkFalsy: true})
    .withMessage("Invalid Start Date"),
  check("endDate")
     .custom((value, { req }) => {
       if(value <= req.body.startDate) {
         throw new Error("endDate cannot be on or before startDate")
       }
       return true
     })
    ,
  handleValidationErrors
]

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

//get all spots owned by current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
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

  res.json({
    spots: spots,
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
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, descripton, price } =
    req.body;

  const { user } = req;

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

//create image for a spot owned by current user
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const spotId = req.params.spotId;
  const { user } = req;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: user.id,
    },
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spotImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  res.json(spotImage);
});

// edit a spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, descripton, price } =
    req.body;
  const spotId = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: user.id,
    },
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const updatedSpot = await spot.update({
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

  res.json(updatedSpot);
});

//delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.spotId;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: user.id,
    },
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  await spot.destroy();

  res.status(200).json({
    message: "Successfully deleted spot.",
  });
});

//get all reviews by spotId
router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = req.params.spotId;

  const spotFound = await Spot.findByPk(spotId);

  if (!spotFound) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spotReviews = await Review.findAll({
    where: {
      spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.json({
    Reviews: spotReviews,
  });
});

//Create a review for spot based on spotId
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const spotId = req.params.spotId;
    const { review, stars } = req.body;
    const { user } = req;

    const spotFound = await Spot.findByPk(spotId);

    if (!spotFound) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const reviewExistsForSpot = await Review.findOne({
      where: {
        userId: user.id,
        spotId,
      },
    });

    if (reviewExistsForSpot) {
      const err = new Error("User already has a review for this spot.");
      err.status = 403;
      return next(err);
    }

    const newReview = await Review.create({
      userId: user.id,
      spotId,
      review,
      stars,
    });

    res.json(newReview);
  }
);

//Get all Booking for a spot based on spotId
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const { user } = req;

  const spotFound = await Spot.findByPk(spotId);

  if (!spotFound) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (user.id === spotFound.ownerId) {
    const ownerBookings = await Booking.findAll({
      where: {
        spotId,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    return res.json({
      Bookings: ownerBookings,
    });
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });

    return res.json({
      Bookings: bookings,
    });
  }
});

//Create a Booking from a spot based on spotId
router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;

    const spotFound = await Spot.findOne({
      where: {
        id: spotId
      },
      include: {
        model: Booking
      }
    });

    if (!spotFound || spotFound.ownerId === user.id) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const bookings = spotFound.Bookings;

    for(const booking of bookings) {
      if(startDate >= booking.startDate && startDate <= booking.endDate) {
        const err = new Error("Sorry, this spot is already booked for the specified dates")
        err.status = 403
        err.errors = ["Start date conflicts with an existing booking"]
        return next(err)
      } else if (endDate >= booking.startDate && endDate <= booking.endDate) {
        const err = new Error("Sorry, this spot is already booked for the specified dates")
        err.status = 403
        err.errors = ["End date conflicts with an existing booking"]
        return next(err)
      }
    }

    const newBooking = await Booking.create({
      spotId,
      userId: user.id,
      startDate,
      endDate
    })

    res.json(newBooking)

  });

module.exports = router;

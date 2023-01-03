const express = require("express");
const { Booking, Spot, SpotImage, sequelize } = require("../../db/models");
const {
  requireAuth,
  checkOwnership,
  checkDeleteOwnership,
  checkPermission,
  getEntity,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const moment = require("moment");

const router = express.Router();

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Invalid Start Date"),
  check("endDate").custom((value, { req }) => {
    if (value <= req.body.startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  handleValidationErrors,
];

//get all current user Bookings
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const userBookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: {
        model: SpotImage,
        as: "previewImage",
        required: false,
        where: {
          preview: true,
        },
        attributes: ["url"]
      },
    },
  });

  const plainUserBookings = userBookings.map(userBooking => {
    const plainUserBooking = userBooking.get({ plain: true });
    plainUserBooking.Spot.previewImage = plainUserBooking.Spot.previewImage?.url;
    return plainUserBooking
  })

  res.json({
    Bookings: plainUserBookings,
  });
});

//delete a booking
router.delete(
  "/:id",
  [
    ...requireAuth,
    checkPermission([1, 2]),
    getEntity("booking", true),
    checkDeleteOwnership,
  ],
  async (req, res, next) => {
    const spotFound = await Spot.findOne({
      where: {
        id: req.entity.spotId,
      },
    });

    if (!spotFound) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (req.entity.startDate > moment().format("YYYY-MM-DD")) {
      await req.entity.destroy();
    } else {
      const err = new Error(
        "Bookings that have been started can't be deleted."
      );
      err.status = 403;
      return next(err);
    }

    res.json({
      message: "Successfully deleted Booking.",
    });
  }
);

//edit a Booking
router.put(
  "/:id",
  [
    ...requireAuth,
    checkPermission([1, 2]),
    getEntity("booking", true),
    checkOwnership,
  ],
  validateBooking,
  async (req, res, next) => {
    const { startDate, endDate } = req.body;

    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Spot,
        include: {
          model: Booking,
        },
      },
    });

    const bookings = booking.Spot.Bookings;

    if (bookings.length !== 0) {
      for (const booked of bookings) {
        if (startDate >= booked.startDate && startDate <= booked.endDate) {
          const err = new Error(
            "Sorry, this spot is already booked for the specified dates"
          );
          err.status = 403;
          err.errors = ["Start date conflicts with an existing booking"];
          return next(err);
        } else if (endDate >= booked.startDate && endDate <= booked.endDate) {
          const err = new Error(
            "Sorry, this spot is already booked for the specified dates"
          );
          err.status = 403;
          err.errors = ["End date conflicts with an existing booking"];
          return next(err);
        }
      }
    }

    if (req.entity.endDate < moment().format("YYYY-MM-DD")) {
      const err = new Error("Past bookings can't be modified");
      err.status = 403;
      return next(err);
    }

    const updatedBooking = await req.entity.update({
      startDate,
      endDate,
    });

    res.json(updatedBooking);
  }
);

module.exports = router;

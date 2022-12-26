const express = require("express");
const { Booking, Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
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
    include: [
      {
        model: Spot,
      },
    ],
  });

  res.json({
    Bookings: userBookings,
  });
});

//delete a booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const bookingId = req.params.bookingId;

  const bookingFound = await Booking.findOne({
    where: {
      id: bookingId,
    },
  });

  const spotFound = await Spot.findOne({
    where: {
      id: bookingFound.spotId,
      ownerId: user.id,
    },
  });

  if (!spotFound && (!bookingFound || bookingFound.userId !== user.id)) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (bookingFound.startDate > moment().format("YYYY-MM-DD")) {
    await bookingFound.destroy();
  } else {
    const err = new Error("Bookings that have been started can't be deleted.");
    err.status = 403;
    return next(err);
  }

  res.json({
    message: "Successfully deleted Booking.",
  });
});

//edit a Booking
router.put("/:bookingId", requireAuth, validateBooking, async (req, res, next) => {
  const { user } = req;
  const { startDate, endDate } = req.body;
  const bookingId = req.params.bookingId;

  const booking = await Booking.findOne({
    where: {
      id: bookingId,
      userId: user.id
    },
    include: [
      {
        model: Spot,
        include: {
          model: Booking
        }
      }
    ]
  })

  if(!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  const bookings = booking.Spot.Bookings;
  for(const booked of bookings) {
    if(startDate >= booked.startDate && startDate <= booked.endDate) {
      const err = new Error("Sorry, this spot is already booked for the specified dates")
      err.status = 403
      err.errors = ["Start date conflicts with an existing booking"]
      return next(err)
    } else if (endDate >= booked.startDate && endDate <= booked.endDate) {
      const err = new Error("Sorry, this spot is already booked for the specified dates")
      err.status = 403
      err.errors = ["End date conflicts with an existing booking"]
      return next(err)
    }
  }

  if(booking.endDate < moment().format("YYYY-MM-DD")) {
    const err = new Error("Past bookings can't be modified")
    err.status = 403
    return next(err)
  }

  const updatedBooking = await booking.update({
    startDate,
    endDate
  })

  res.json(updatedBooking)
});

module.exports = router;

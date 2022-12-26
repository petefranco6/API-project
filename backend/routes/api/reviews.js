const express = require("express");
const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
  sequelize,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({checkFalsy: true})
    .withMessage("Review text is required"),
  check("stars")
    .exists({checkFalsy: true})
    .isInt({min:1, max:5})
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

//   const spot = await Spot.findOne({
//     where: {

//     }
//     include: [
//         {
//             model: Review,
//             attributes: []
//         }
//     ],
//     attributes: {
//         include: [
//             [Sequelize.col("SpotImages.url"), "previewImage"]
//         ]
//     }
//   })
  const userReviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        include: [{
            model: SpotImage,
            attributes: {}
        }],
        // attributes: {
        //     include: [
        //         [sequelize.literal("Spot.SpotImages.url"), "previewImage"],
        //     ]
        // }
      },
      {
        model: ReviewImage,
      },
    ],
  });

  res.json({
    Reviews: userReviews,
  });
});

//Add an img to a review using reviewId
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    const {url} = req.body;
    const { user} = req;

    const reviewId = req.params.reviewId;

    const review = await Review.findOne({
        where: {
            userId: user.id,
            id: reviewId
        }
    })

    if(!review) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        return next(err)
    }

    const newReviewImage = await ReviewImage.create({
        reviewId,
        url
    })

    res.json({
        id:newReviewImage.reviewId,
        url: newReviewImage.url
    })
})

//Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res, next) => {
  const { user } = req;
  const {review, stars} = req.body;
  const reviewId = req.params.reviewId

  const foundReview = await Review.findOne({
    where: {
      id: reviewId,
      userId: user.id
    }
  })

  if(!foundReview) {
    const err = new Error("Review couldn't be found")
    err.status = 404
    return next(err)
  }

  const editedReview = await foundReview.update({
    review,
    stars
  })

  res.json(editedReview)
})

//Delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviewId = req.params.reviewId

  const review = await Review.findOne({
    where: {
      id: reviewId,
      userId: user.id
    }
  })

  if(!review) {
    const err = new Error ("Review couldn't be found")
    err.status = 404
    return next(err)
  }

  await review.destroy();

  res.status(200).json({
    message: "Successfully deleted review."
  })

})

module.exports = router;

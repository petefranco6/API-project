const express = require("express");
const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
  sequelize,
} = require("../../db/models");
const {
  requireAuth,
  getEntity,
  checkOwnership,
  checkPermission,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

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
        include: {
          model: SpotImage,
          where: {
            preview: true,
          },
          attributes: [[sequelize.col("url"), "previewImage"]],
        },
        // attributes: {
        //   include: [[sequelize.fn("COUNT", sequelize.col("spotimages.id")), "previewImage"]],
        // },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.json({
    Reviews: userReviews,
  });
});

//Add an img to a review using reviewId
router.post(
  "/:id/images",
  [
    ...requireAuth,
    checkPermission([1, 2]),
    getEntity("review", true),
    checkOwnership,
  ],
  async (req, res, next) => {
    const { url } = req.body;

    const newReviewImage = await ReviewImage.create({
      reviewId: req.entity.id,
      url,
    });

    res.json({
      id: newReviewImage.reviewId,
      url: newReviewImage.url,
    });
  }
);

//Edit a Review
router.put(
  "/:id",
  [
    ...requireAuth,
    checkPermission([1, 2]),
    getEntity("review", true),
    checkOwnership,
  ],
  validateReview,
  async (req, res, next) => {
    const { review, stars } = req.body;

    const editedReview = await req.entity.update({
      review,
      stars,
    });

    res.json(editedReview);
  }
);

//Delete a review
router.delete(
  "/:id",
  [
    ...requireAuth,
    checkPermission([1, 2]),
    getEntity("review", true),
    checkOwnership,
  ],
  async (req, res, next) => {
    await req.entity.destroy();

    res.status(200).json({
      message: "Successfully deleted review.",
    });
  }
);

module.exports = router;

const express = require("express");
const { Review, ReviewImage,} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");


const router = express.Router();

//delete a review image
router.delete("/:reviewImageId", requireAuth, async (req, res, next) => {
    const { user } = req
    const reviewImageId = req.params.reviewImageId;

    const reviewImageFound = await ReviewImage.findByPk(reviewImageId)

    const reviewFound = await Review.findOne({
        where: {
            id: reviewImageFound.reviewId,
            userId: user.id
        }
    })

    if (!reviewFound || !reviewImageFound) {
        const err = new Error("review image couldn't be found")
        err.status = 404
        return next(err)
    }

    await reviewImageFound.destroy()
    res.json({
        message: "Successfuly deleted review image"
    })
})


module.exports = router;

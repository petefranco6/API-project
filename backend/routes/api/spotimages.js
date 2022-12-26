const express = require("express");
const { Spot, SpotImage,} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");


const router = express.Router();

//delet a spot image
router.delete("/:spotImageId", requireAuth, async (req, res, next) => {
    const { user } = req
    const spotImageId = req.params.spotImageId;

    const spotImageFound = await SpotImage.findByPk(spotImageId)

    const spotFound = await Spot.findOne({
        where: {
            id: spotImageFound.spotId,
            ownerId: user.id
        }
    })

    if (!spotFound || !spotImageFound) {
        const err = new Error("Spot image couldn't be found")
        err.status = 404
        return next(err)
    }

    await spotImageFound.destroy()
    res.json({
        message: "Successfuly deleted spot image"
    })
})

module.exports = router

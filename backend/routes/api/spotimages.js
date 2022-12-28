const express = require("express");
const { SpotImage } = require("../../db/models");
const { requireAuth, checkSpotOwnership, checkPermission, getEntity } = require("../../utils/auth");


const router = express.Router();

//delet a spot image
router.delete("/:id", [...requireAuth, checkPermission([1,2]),getEntity("spotImage", true), checkSpotOwnership], async (req, res, next) => {

    const spotImage = await SpotImage.findByPk(req.params.id)

    if (!spotImage) {
        const err = new Error("Spot image couldn't be found")
        err.status = 404
        return next(err)
    }

    await spotImage.destroy()
    res.json({
        message: "Successfuly deleted spot image"
    })
})

module.exports = router

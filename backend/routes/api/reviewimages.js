const express = require("express");
const { ReviewImage,} = require("../../db/models");
const { requireAuth, checkOwnership ,checkPermission, getEntity } = require("../../utils/auth");


const router = express.Router();

//delete a review image
router.delete("/:id", [...requireAuth, checkPermission([1,2]),getEntity("reviewImage", true), checkOwnership], async (req, res, next) => {

    const reviewImageFound = await ReviewImage.findByPk(req.params.id)

    if (!reviewImageFound) {
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

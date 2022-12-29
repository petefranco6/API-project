// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { Booking, Review, User, Spot, SpotImage, ReviewImage } = require("../db/models");
// const { Permission, RolePermission } = require("../db/models");
const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope("currentUser").findByPk(id);
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = [
  restoreUser,
  function (req, _res, next) {
    if (req.user) return next();

    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors = ["Authentication required"];
    err.status = 401;
    return next(err);
  },
];

const getEntity = (tableName, mustBelongTo) => {
  return async (req, _res, next) => {
    const { id } = req.params;

    let foundEntity = null;
    if (tableName === "review") {
      foundEntity = await Review.findByPk(id);
    } else if (tableName === "booking") {
      foundEntity = await Booking.findByPk(id)
    } else if (tableName === "spot") {
      foundEntity = await Spot.findByPk(id)
    } else if(tableName === "spotImage") {
      const spotImage = await SpotImage.findByPk(id)
      if(!spotImage){
        const err = new Error("Spot Image couldn't be found")
        err.status(404)
        return next(err)
      }
      foundEntity = await Spot.findByPk(spotImage.spotId)
    } else if (tableName === "reviewImage") {
      const reviewImage = await ReviewImage.findByPk(id)
      if(!reviewImage){
        const err = new Error("Review Image couldn't be found")
        err.status(404)
        return next(err)
      }
      foundEntity = await Review.findByPk(reviewImage.reviewId)
    }

    req.entity = foundEntity;
    req.mustBelongTo = mustBelongTo;

    if (req.entity === null) {
      const err = new Error(`${tableName} couldn't be found`);
      err.status = 404;
      return next(err);
    }

    return next();
  };
};

const checkOwnership = async (req, _res, next) => {
  if (req.user.roleId === 2 || req.entity === null) return next();

  if (req.entity.userId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  return next();
};

const checkDeleteOwnership = async (req, _res, next) => {
  if (req.user.roleId === 2 || req.entity === null) return next();

  const spot = await Spot.findByPk(req.entity.spotId)

  if(!spot) return next()

  if (req.entity.userId !== req.user.id && spot.ownerId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  return next();
};

const checkSpotOwnership = async (req, _res, next) => {
  if (req.user.roleId === 2 || req.entity === null) return next();

  if (req.mustBelongTo) {
    if (req.entity.ownerId !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
  } else {
    if (req.entity.ownerId === req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
  }
  return next();
};

const checkPermission = (permissions) => {
  return async (req, _res, next) => {
    if (permissions.includes(req.user.roleId)) return next();

    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  };
};

// const verifyRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if(!req.user.roles) {
//       const err = new Error("authorization required")
//       return next(err)
//     }
//     const rolesArray = [...allowedRoles]
//     let reqRolesArray = Object.values(req.user.roles)
//     reqRolesArray = reqRolesArray.map(role => parseInt(role))
//     console.log(rolesArray)
//     console.log(reqRolesArray)
//     const result = reqRolesArray.map(role => rolesArray.includes(role)).find(val => val === true);
//     if(!result) {
//       const err = new Error("authorization required")
//       return next(err)
//     }
//     next()
//   }
// }

module.exports = {
  setTokenCookie,
  restoreUser,
  checkOwnership,
  checkSpotOwnership,
  checkDeleteOwnership,
  getEntity,
  checkPermission,
  requireAuth,
};

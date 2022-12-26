"use strict";
const { Model } = require("sequelize");
const moment = require("moment")
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, { foreignKey: "reviewId" });
    }
  }
  ReviewImage.init(
    {
      reviewId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("createdAt")).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("updatedAt")).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        },
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};

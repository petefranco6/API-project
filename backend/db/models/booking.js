"use strict";
const { Model } = require("sequelize");
const moment = require("moment")
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init(
    {
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      startDate:DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        },
      }
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};

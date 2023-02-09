import { useState } from "react";
import { useDispatch } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import classes from "./BookingItem.module.css";
import deleteIcon from "../../icons/delete.png";
import { Link } from "react-router-dom";
import moon from "../../icons/moon.png";
import calender from "../../icons/calender.png";
import arrow from "../../icons/arrow.png";
import location from "../../icons/location.png";
import price from "../../icons/price.png";

const BookingItem = ({ booking }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const diffInDays = (a, b) => {
    const date1 = new Date(a);
    const date2 = new Date(b);

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  };

  const deleteBookingHandler = (e) => {
    e.preventDefault();
    dispatch(bookingsActions.deleteBooking(booking.id)).catch(async (res) => {
      const data = await res.json();
      dispatch(bookingsActions.setMessage(data.message));
    });
  };

  if (booking.Spot) {
    return (
      <>
        <Link
          to={`/spots/${booking.Spot.id}`}
          className={classes["booking-item"]}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={classes["booking-img"]}>
            <img alt="" src={booking.Spot.previewImage} />
          </div>
          <div className={classes["booking-info"]}>
            <div className={classes.name}>{booking.Spot.name}</div>
            <div className={classes["booking-dates-nights"]}>
              <div className={classes.nights}>
                <img src={moon} alt="" />
                {diffInDays(booking.startDate, booking.endDate)} nights:
              </div>
              <div className={classes["booking-dates"]}>
                <div className={classes["start-date"]}>
                  <img alt="" src={calender} />
                  {booking.startDate}
                </div>
                <img alt="" src={arrow} />
                <div className={classes["end-date"]}>
                  <img alt="" src={calender} />
                  {booking.endDate}
                </div>
              </div>
            </div>
            <div className={classes["price-address"]}>
              <div className={classes.price}>
                <img alt="" src={price} />
                Total Price: $
                {diffInDays(booking.startDate, booking.endDate) *
                  booking.Spot.price}{" "}
              </div>
              <div className={classes.address}>
                <img alt="" src={location} />
                <div>
                  <div>{`${booking.Spot.address},`}</div>
                  <div>{`${booking.Spot.city}, ${booking.Spot.state}`}</div>
                  <div>{booking.Spot.country}</div>
                </div>
              </div>
            </div>
          </div>
          {isHovered && (
            <div
              className={classes["delete-icon"]}
              onClick={deleteBookingHandler}
            >
              <img alt="" src={deleteIcon} />
            </div>
          )}
        </Link>
      </>
    );
  }
};

export default BookingItem;

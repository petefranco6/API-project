import { useState } from "react";
import { useDispatch } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import classes from "./BookingItem.module.css";
import deleteIcon from "../../icons/delete.png";

const BookingItem = ({ booking, handleCheckboxChange }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteBookingHandler = () => {
    dispatch(bookingsActions.deleteBooking(booking.id));
  };

  const handleChange = (e) => {
    handleCheckboxChange(e);
    setIsChecked(!isChecked);
  }

  if (booking.Spot) {
    return (
      <>
        <li
          style={{ backgroundColor: isChecked ? "rgb(244, 209, 209)" : "white" }}
          className={classes["booking-item"]}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={classes["checkbox-booking"]}>
            <input
              type="checkbox"
              value={booking.id}
              checked={isChecked}
              onChange={handleChange}
            />
            <div>{booking.Spot.name}</div>
          </div>
          <div className={classes["booking-img"]}>
            <img alt="" src={booking.Spot.previewImage} />
          </div>
          <div>
            <div>{booking.Spot.address}</div>
            <div>{`${booking.Spot.city}, ${booking.Spot.state}`}</div>
            <div>{booking.Spot.country}</div>
          </div>
          <div>
            <div>{`Start Date: ${booking.startDate}`}</div>
            <div>{`End Date:  ${booking.endDate}`}</div>
          </div>
          {isHovered && (
            <div
              className={classes["delete-icon"]}
              onClick={deleteBookingHandler}
            >
              <img alt="" src={deleteIcon} />
            </div>
          )}
        </li>
        <div className={classes.divider}></div>
      </>
    );
  }
};

export default BookingItem;

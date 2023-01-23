import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import BookingItem from "../BookingItem/BookingItem";
import classes from "./UserBookingsPage.module.css";
import { Link } from "react-router-dom";
import deleteIcon from "../../icons/delete.png";

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    dispatch(bookingsActions.getCurrentBookings());
  }, [dispatch]);

  const handleCheckboxChange = (e) => {
    const item = e.target.value;
    const isChecked = e.target.checked;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: isChecked,
    }));
  };

  const deleteBookingsSelectedHandler = () => {
    for(const key in checkedItems) {
      if(checkedItems[key] === true) {
        dispatch(bookingsActions.deleteBooking(key))
      }
    }
  }

  const noBookingsContent = (
    <div className={classes["no-trips"]}>
      <h2>No trips booked...yet!</h2>
      <p>Time to dust off your bags and start planning your next adventure</p>
      <Link className={classes.search} to="/">Start searching</Link>
      <div className={classes.divider}></div>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <h1>Trips</h1>
        {Object.values(checkedItems).some((value) => value) && (
          <div className={classes["delete-icon"]}>
            <img alt="" src={deleteIcon} onClick={deleteBookingsSelectedHandler} />
          </div>
        )}
      </div>
      <div className={classes.divider}></div>
      {bookings.length === 0 && noBookingsContent}
      <ul>
        {bookings.map((booking) => (
          <BookingItem
            booking={booking}
            key={booking.id}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import BookingItem from "../BookingItem/BookingItem";
import classes from "./UserBookingsPage.module.css";
import { Link } from "react-router-dom";

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);

  useEffect(() => {
    dispatch(bookingsActions.getCurrentBookings());
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <h1>Trips</h1>
      <div className={classes.divider}></div>
      {bookings.length < 1 && (
        <div className={classes["no-trips"]}>
          <h2>No trips booked...yet!</h2>
          <p>
            Time to dust off your bags and start planning your next adventure
          </p>
          <Link to="/">Start searching</Link>
        </div>
      )}
      {bookings.map((booking) => (
        <BookingItem details={booking} key={booking.id} />
      ))}
      <div className={classes.divider}></div>
    </div>
  );
};

export default UserBookingsPage;

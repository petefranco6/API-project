import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import BookingItem from "../BookingItem/BookingItem";
import { Link } from "react-router-dom";
import "./UserBookingsPage.css";
import { useState } from "react";

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const bookings = useSelector((state) => state.bookings.bookings);
  const bannerMessage = useSelector((state) => state.bookings.bannerMessage);

  useEffect(() => {
    dispatch(bookingsActions.getCurrentBookings())
      .then(setIsLoading(false));
  }, [dispatch]);

  const noBookingsContent = (
    <div className="no-trips">
      <h2>No trips booked...yet!</h2>
      <p>Time to dust off your bags and start planning your next adventure</p>
      <Link className="search-booking" to="/">
        Start searching
      </Link>
      <div className="bookings-divider"></div>
    </div>
  );

  if (!isLoading) {
    return (
      <div className="user-bookings-container">
        <div className="booking-title">
          {Object.keys(bannerMessage).includes("error") && (
            <div className="banner error">{bannerMessage["error"]}</div>
          )}
          {Object.keys(bannerMessage).includes("success") && (
            <div className="banner success">{bannerMessage["success"]}</div>
          )}
          <h1>Trips</h1>
        </div>
        <div className="bookings-divider"></div>
        {bookings.length === 0 && noBookingsContent}
        {bookings.map((booking) => (
          <BookingItem booking={booking} key={booking.id} />
        ))}
      </div>
    );
  }
};

export default UserBookingsPage;

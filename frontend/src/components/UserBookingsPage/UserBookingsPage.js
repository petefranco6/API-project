import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import BookingItem from "../BookingItem/BookingItem";
import { Link } from "react-router-dom";
import deleteIcon from "../../icons/delete.png";
import "./UserBookingsPage.css"

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const message = useSelector(state => state.bookings.message);
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
    <div className="no-trips">
      <h2>No trips booked...yet!</h2>
      <p>Time to dust off your bags and start planning your next adventure</p>
      <Link className="search-booking" to="/">Start searching</Link>
      <div className="bookings-divider"></div>
    </div>
  );

  return (
    <div className="user-bookings-container">
      <div className="booking-title">
        {Object.keys(message).includes('error') && <div className="banner error">{message['error']}</div>}
        {Object.keys(message).includes('success') && <div className="banner success">{message['success']}</div>}
        <h1>Trips</h1>
        {Object.values(checkedItems).some((value) => value) && (
          <div className="delete-icon-booking">
            <img alt="" src={deleteIcon} onClick={deleteBookingsSelectedHandler} />
          </div>
        )}
      </div>
      <div className="bookings-divider"></div>
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

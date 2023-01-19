import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import BookingItem from "../BookingItem/BookingItem";

const UserBookingsPage = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings.bookings)

    useEffect(() => {
        dispatch(bookingsActions.getCurrentBookings())
    }, [dispatch])

    return (
        <div>
            {bookings.map(booking => <BookingItem details={booking} key={booking.id} />)}
        </div>
    )
}

export default UserBookingsPage;

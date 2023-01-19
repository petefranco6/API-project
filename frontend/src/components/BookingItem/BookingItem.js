import { useDispatch } from "react-redux";
import * as bookingsActions from "../../store/bookings";

const BookingItem = ({ details }) => {
    const dispatch = useDispatch();

    const deleteBookingHandler = () => {
        dispatch(bookingsActions.deleteBooking(details.id))
    }

    return (
        <div>
            <div>{details.startDate}</div>
            <button onClick={deleteBookingHandler}>Delete</button>
        </div>
    )
}

export default BookingItem;

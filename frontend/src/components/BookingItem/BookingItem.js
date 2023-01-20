import { useDispatch } from "react-redux";
import * as bookingsActions from "../../store/bookings";
import SpotItem from "../SpotItem.js/SpotItem";


const BookingItem = ({ details }) => {
    const dispatch = useDispatch();

    const deleteBookingHandler = () => {
        dispatch(bookingsActions.deleteBooking(details.id))
    }

    return (
        <div>
            <div>{details.startDate}</div>
            <SpotItem key={details.Spot.id} details={details.Spot} />
            <button onClick={deleteBookingHandler}>Delete</button>
        </div>
    )
}

export default BookingItem;

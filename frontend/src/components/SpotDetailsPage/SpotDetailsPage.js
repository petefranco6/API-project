import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotsActions from "../../store/spots";
import * as bookingsActions from "../../store/bookings";
import classes from "./SpotDetailsPage.module.css";

const SpotDetailsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const spot = useSelector((state) => state.spots.spot);

  useEffect(() => {
    dispatch(spotsActions.getSpotDetails(params.spotId));
  }, [dispatch, params.spotId]);

  const { spotId } = params;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(bookingsActions.createBooking({ checkin, checkout, spotId }));
  };

  return (
    <div>
      <div className={classes.card}>
        <form onSubmit={handleSubmit}>
          <label>
            Check-in
            <input
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              required
            />
          </label>
          <label>
            Checkout
            <input
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            required
            />
          </label>
          <button type="submit"> Reserve </button>
        </form>
      </div>
    </div>
  );
};

export default SpotDetailsPage;

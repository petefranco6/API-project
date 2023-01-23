import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotsActions from "../../store/spots";
import * as bookingsActions from "../../store/bookings";
import "./SpotDetailsPage.css";

const SpotDetailsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [errors, setErrors] = useState([]);
  const spot = useSelector((state) => state.spots.spot);

  useEffect(() => {
    dispatch(spotsActions.getSpotDetails(params.spotId));
  }, [dispatch, params.spotId]);

  const { spotId } = params;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    dispatch(
      bookingsActions.createBooking({ checkin, checkout, spotId })
      )
      .catch(async (res) => {
      const data = await res.json();
      if (data.errors) setErrors(data.errors);
    });
  };

  let imagePreview;
  let otherImages;
  let numOfReviews = "New";
  let stars;

  if (spot.spotImages) {
    imagePreview = spot.spotImages
      .filter((spotImg) => spotImg.preview === true)
      .map((spotImg) => (
        <img
          className={`preview-${spotImg.preview}`}
          key={spotImg.id}
          alt=""
          src={spotImg.url}
        />
      ));
  }

  if (spot.spotImages) {
    otherImages = spot.spotImages
      .filter((spotImg) => spotImg.preview !== true)
      .map((spotImg) => <img key={spotImg.id} alt="" src={spotImg.url} />);

    stars = Math.round(parseInt(spot.avgStarRating) * 1e8) / 1e8;
  }

  if (spot.numReviews > 0) {
    numOfReviews = `${spot.numReviews} reviews`;
  }

  return (
    <div className={"spot-details-container"}>
      <div className={"info"}>
        <h1>{spot.description}</h1>
        <div className={"spot-details-description"}>
          {spot.avgStarRating && (
            <span>
              <i className="fa-solid fa-star"></i>
              {stars}
            </span>
          )}
          <span>{numOfReviews}</span>
          <span>{`${spot.city},${spot.state},${spot.country}`}</span>
        </div>
      </div>
      <div className="spot-details-content">
        {spot.spotImages && (
          <div className={`spot-images-container ${spot.spotImages.length}`}>
            {imagePreview}
            <div className={`preview-false ${spot.spotImages.length - 1}`}>
              {otherImages}
            </div>
          </div>
        )}
        <div className={"reserve-date-card"}>
          <div className="reserve-form-info">
            <strong className="form-price-per-night">${spot.price}</strong>

            {spot.avgStarRating && (
              <p>
                <i className="fa-solid fa-star"></i> {stars} - ${numOfReviews}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="reserve-form">
            <input
              className="checkin-input"
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              required
            />

            <input
              className="checkout-input"
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              required
            />

            <button className={"reserve"} type="submit">
              Reserve
            </button>
            <ul className="errors-list">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </form>
          <div className="reserve-info-calc">
            <p>You won't be charged yet</p>
            <div className="calc-price">
              <p>${spot.price} X 5 nights</p>
              <p>$1000</p>
            </div>
            <div>
              <p>Service fee</p>
              <p>$243</p>
            </div>
            <div className="total-price">
              <p>Total before taxes</p>
              <p>$1000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetailsPage;

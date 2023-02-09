import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotsActions from "../../store/spots";
import * as bookingsActions from "../../store/bookings";
import "./SpotDetailsPage.css";
import star from "../../icons/star.png";

const SpotDetailsPage = () => {
  let defaultCheckout = new Date();
  defaultCheckout.setDate(defaultCheckout.getDate() + 1);
  defaultCheckout = defaultCheckout.toISOString().substring(0, 10);

  const params = useParams();
  const dispatch = useDispatch();
  const [checkin, setCheckin] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [checkout, setCheckout] = useState(defaultCheckout);
  const spot = useSelector((state) => state.spots.spot);
  const bannerMessage = useSelector((state) => state.bookings.bannerMessage);
  const [errors, setErrors] = useState([]);
  const currentUser = useSelector((state) => state.session.user);
  const isLoading = useSelector((state) => state.spots.isLoading);

  useEffect(() => {
    dispatch(spotsActions.getSpotDetails(params.spotId))
  }, [dispatch, params.spotId]);

  const { spotId } = params;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      bookingsActions.createBooking({ checkin, checkout, spotId })
    )
    .catch(async (res) => {
      const data = await res.json();
      if (data.errors) setErrors(data.errors);
    });
  };

  const diffInDays = (a, b) => {
    const date1 = new Date(a);
    const date2 = new Date(b);

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
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

  if (!isLoading) {
    return (
      <div className={"spot-details-container"}>
        {Object.keys(bannerMessage).includes("success") && (
          <div className="banner success">{bannerMessage["success"]}</div>
        )}
        <div className={"info"}>
          <h1>{spot.name}</h1>
          <div className={"spot-details-description"}>
            {spot.avgStarRating && (
              <span>
                <img src={star} alt="" />
                {stars}
              </span>
            )}
            <span>{`${numOfReviews} - ${spot.city}, ${spot.state}, ${spot.country}`}</span>
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
          <div className="spot-details-info">
            <div>
              Description:
              {spot.description}
            </div>
            {currentUser?.id !== spot.ownerId && (
              <div className={"reserve-date-card"}>
                <div className="reserve-form-info">
                  <div className="form-price-per-night">
                    <div className="form-price">${spot.price}</div>
                    <div className="form-night">night</div>
                  </div>

                  {spot.avgStarRating && (
                    <p className="review-rating">
                      <img src={star} alt="" /> {`${stars} - ${numOfReviews}`}
                    </p>
                  )}
                  {!spot.avgStarRating && <p>New</p>}
                </div>

                <form onSubmit={handleSubmit} className="reserve-form">
                  <div className="date-inputs">
                    <div className="checkin-input">
                      <label>CHECK-IN</label>
                      <input
                        type="date"
                        value={checkin}
                        onChange={(e) => {
                          setCheckin(e.target.value)
                          setErrors([])
                        }}
                        required
                      />
                    </div>
                    <div className="checkout-input">
                      <label>CHECKOUT</label>
                      <input
                        type="date"
                        value={checkout}
                        onChange={(e) => {
                          setCheckout(e.target.value)
                          setErrors([])
                        }}
                        required
                      />
                    </div>
                  </div>
                  <button className={"reserve"} type="submit">
                    Reserve
                  </button>
                  <ul className="errors-list">
                    {errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </form>
                {checkin && checkout && diffInDays(checkin, checkout) > 0 && (
                  <div className="reserve-info-calc">
                    <p>You won't be charged yet</p>
                    <div className="calc-price">
                      <p>
                        ${spot.price} X {diffInDays(checkin, checkout)} nights
                      </p>
                      <p>${spot.price * diffInDays(checkin, checkout)}</p>
                    </div>
                    <div>
                      <p>Service fee</p>
                      <p>$243</p>
                    </div>
                    <div className="total-price">
                      <p>Total before taxes</p>
                      <p>${243 + spot.price * diffInDays(checkin, checkout)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default SpotDetailsPage;

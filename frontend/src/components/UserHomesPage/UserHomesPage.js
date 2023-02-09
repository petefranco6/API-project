import OpenModalButton from "../OpenModalButton";
import CreateSpotFormModal from "../CreateSpotFormModal/CreateSpotFormModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as spotsActions from "../../store/spots";
import OwnedSpotItem from "../OwnedSpotItem/OwnedSpotItem";
import classes from "./UserHomesPage.module.css";
import deleteIcon from "../../icons/trash.png";

const UserHomesPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const ownedSpots = useSelector((state) => state.spots.ownedSpots);
  const bannerMessage = useSelector((state) => state.spots.bannerMessage);
  const [checkedItems, setCheckedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(spotsActions.getOwnedSpots())
      .then(setIsLoading(false));
  }, [dispatch]);

  const handleCheckboxChange = (e) => {
    const item = e.target.value;
    const isChecked = e.target.checked;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: isChecked,
    }));
  };

  const deleteSpotsSelectedHandler = () => {
    for (const key in checkedItems) {
      if (checkedItems[key] === true) {
        checkedItems[key] = false;
        dispatch(spotsActions.deleteSpot(key));
      }
    }
  };

  return (
    <div className={classes.container}>
      {Object.keys(bannerMessage).includes("error") && (
        <div className="banner error">{bannerMessage["error"]}</div>
      )}
      {Object.keys(bannerMessage).includes("success") && (
        <div className="banner success">{bannerMessage["success"]}</div>
      )}
      <div className={classes.welcome}>
        {ownedSpots.length > 0 ? <h1>{ownedSpots.length} Listings</h1> : <h1>Welcome {currentUser.firstName}!</h1>}

        {Object.values(checkedItems).some((value) => value) && (
          <img
            alt=""
            className={classes.delete}
            src={deleteIcon}
            onClick={deleteSpotsSelectedHandler}
          />
        )}
        <OpenModalButton
          className="add-listing"
          buttonText="Create Listing"
          modalComponent={<CreateSpotFormModal />}
        />
      </div>
      <div>
        { !isLoading && ownedSpots.length > 0 && <table>
          <thead>
            <tr className={classes["table-header"]}>
              <th>Listing</th>
              <th>Address</th>
              <th>Name</th>
              <th>Price</th>
              <th>Average Rating</th>
              <th>Current # of Bookings</th>
            </tr>
          </thead>
          <tbody>
            {ownedSpots.map((spot) => (
              <OwnedSpotItem
                details={spot}
                key={spot.id}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </tbody>
        </table>}
      </div>
      {!isLoading && ownedSpots.length === 0 && <h1 className={classes["no-listings"]}>No listings yet!</h1>}
      {isLoading && <h1>Loading....</h1>}
    </div>
  );
};

export default UserHomesPage;

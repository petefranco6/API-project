import OpenModalButton from "../OpenModalButton";
import CreateSpotFormModal from "../CreateSpotFormModal/CreateSpotFormModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as spotsActions from "../../store/spots";
import OwnedSpotItem from "../OwnedSpotItem/OwnedSpotItem";
import classes from "./UserHomesPage.module.css";
import deleteIcon from "../../icons/delete.png";

const UserHomesPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const ownedSpots = useSelector((state) => state.spots.ownedSpots);
  const [checkedItems, setCheckedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(spotsActions.getOwnedSpots());
    setIsLoading(false);
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
    for(const key in checkedItems) {
      if(checkedItems[key] === true) {
        dispatch(spotsActions.deleteSpot(key))
      }
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.welcome}>
        <h1>Welcome {currentUser.firstName}!</h1>
        <div className={classes["delete-multiple"]}>
          <div className={classes["delete-icon"]}>
            {Object.values(checkedItems).some((value) => value) && (
              <img alt="" src={deleteIcon} onClick={deleteSpotsSelectedHandler} />
            )}
          </div>
          <OpenModalButton
            className="add-listing"
            buttonText="Add a Listing"
            modalComponent={<CreateSpotFormModal />}
          />
        </div>
      </div>
      <div className={classes.divider}></div>
      <ul>
        {!isLoading && ownedSpots.length > 0 &&
          ownedSpots.map((spot) => (
            <OwnedSpotItem
              details={spot}
              key={spot.id}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
      </ul>
      {!isLoading && ownedSpots.length === 0 && <h1>No listings yet!</h1> }
      {isLoading && <h1>Loading....</h1>}
    </div>
  );
};

export default UserHomesPage;

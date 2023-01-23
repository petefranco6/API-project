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
  const ownedSpots = useSelector((state) => state.spots.spots);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    dispatch(spotsActions.getOwnedSpots());
  }, [dispatch]);

  const handleCheckboxChange = (e) => {
    const item = e.target.value;
    const isChecked = e.target.checked;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: isChecked,
    }));
  };

  return (
    <div className={classes.container}>
      <div className={classes.welcome}>
        <h1>Welcome {currentUser.firstName}!</h1>
        <div className={classes["delete-multiple"]}>
          <div className={classes["delete-icon"]}>
            {Object.values(checkedItems).some((value) => value) && (
              <img alt="" src={deleteIcon} />
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
      {ownedSpots.length < 1 && <h1>No listings yet!</h1>}
      <ul>
        {ownedSpots.map((spot) => (
          <OwnedSpotItem
            details={spot}
            key={spot.id}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserHomesPage;
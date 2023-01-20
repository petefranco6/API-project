import OpenModalButton from "../OpenModalButton";
import CreateSpotFormModal from "../CreateSpotFormModal/CreateSpotFormModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotsActions from "../../store/spots";
import OwnedSpotItem from "../OwnedSpotItem/OwnedSpotItem";
import classes from "./UserHomesPage.module.css";

const UserHomesPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const ownedSpots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(spotsActions.getOwnedSpots());
  }, [dispatch]);
  return (
    <div className={classes.container}>
      <div className={classes.welcome}>
        <h1>Welcome {currentUser.firstName}!</h1>
        <OpenModalButton
          buttonText="Add a Listing"
          modalComponent={<CreateSpotFormModal />}
        />
      </div>

      <div>
        {ownedSpots.length < 1 && <h1>No listings yet!</h1>}
        {ownedSpots.map((spot) => (
          <OwnedSpotItem details={spot} key={spot.id} />
        ))}
      </div>
    </div>
  );
};

export default UserHomesPage;

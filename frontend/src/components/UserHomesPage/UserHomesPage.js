import OpenModalButton from "../OpenModalButton";
import CreateSpotFormModal from "../CreateSpotFormModal/CreateSpotFormModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotsActions from "../../store/spots";
import OwnedSpotItem from "../OwnedSpotItem/OwnedSpotItem";

const UserHomesPage = () => {
  const dispatch = useDispatch();
  const ownedSpots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(spotsActions.getOwnedSpots());
  }, [dispatch]);
  return (
    <>
      <OpenModalButton
        buttonText="Add a Listing"
        modalComponent={<CreateSpotFormModal />}
      />
      <div>
        {ownedSpots.length < 1 && <h1>No listings yet!</h1>}
        {ownedSpots.map((spot) => (
          <OwnedSpotItem details={spot} key={spot.id} />
        ))}
      </div>
    </>
  );
};

export default UserHomesPage;

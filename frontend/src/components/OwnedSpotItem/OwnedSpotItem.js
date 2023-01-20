import OpenModalButton from "../OpenModalButton";
import EditSpotFormModal from "../EditSpotFormModal/EditSpotFormModal";
import { useDispatch } from "react-redux";
import * as spotsActions from "../../store/spots";
import SpotItem from "../SpotItem.js/SpotItem";

const OwnedSpotItem = ({ details }) => {
    const dispatch = useDispatch();

    const deleteSpotHandler = () => {
        dispatch(spotsActions.deleteSpot(details.id))
    }
  return (
    <div>
      <SpotItem details={details} />
      <OpenModalButton
        buttonText="Edit"
        modalComponent={<EditSpotFormModal details={details} />}
      />
      <button onClick={deleteSpotHandler}>DELETE</button>
    </div>
  );
};

export default OwnedSpotItem;

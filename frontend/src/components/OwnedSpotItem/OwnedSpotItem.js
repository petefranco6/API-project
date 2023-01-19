import OpenModalButton from "../OpenModalButton";
import EditSpotFormModal from "../EditSpotFormModal/EditSpotFormModal";
import { useDispatch } from "react-redux";
import * as spotsActions from "../../store/spots";

const OwnedSpotItem = ({ details }) => {
    const dispatch = useDispatch();

    const deleteSpotHandler = () => {
        dispatch(spotsActions.deleteSpot(details.id))
    }
  return (
    <div>
      <div>{details.name}</div>
      <div>{details.id}</div>
      <OpenModalButton
        buttonText="Edit"
        modalComponent={<EditSpotFormModal details={details} />}
      />
      <button onClick={deleteSpotHandler}>DELETE</button>
    </div>
  );
};

export default OwnedSpotItem;

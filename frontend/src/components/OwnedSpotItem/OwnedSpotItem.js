import OpenModalButton from "../OpenModalButton";
import EditSpotFormModal from "../EditSpotFormModal/EditSpotFormModal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as spotsActions from "../../store/spots";
import classes from "./OwnedSpotItem.module.css";
import deleteIcon from "../../icons/delete.png";

const OwnedSpotItem = ({ details, handleCheckboxChange }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteSpotHandler = () => {
    dispatch(spotsActions.deleteSpot(details.id));
  };

  const handleChange = (e) => {
    handleCheckboxChange(e);
    setIsChecked(!isChecked);
  };

  return (
    <>
      <li
        style={{ backgroundColor: isChecked ? "rgb(244, 209, 209)" : "white" }}
        className={classes["owned-item"]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={classes["checkbox-owned-spot"]}>
          <input
            type="checkbox"
            value={details.id}
            checked={isChecked}
            onChange={handleChange}
          />
          <div className={classes["spot-info"]}>
            <div className={classes.name}>
              <strong>{details.name}</strong>
            </div>
            <div className={classes["owned-spot-img"]}>
              <img alt="" src={details.previewImage} />
            </div>
            <div className={classes.location}>
              <div>{details.address}</div>
              <div>{`${details.city}, ${details.state}`}</div>
            </div>
          </div>
        </div>
        <div className={classes.description}><strong>Description: </strong>{`${details.description}`}</div>
        {isHovered && (
          <div className={classes["hover-actions"]}>
            <OpenModalButton
              buttonText="Edit"
              className="edit-listing"
              modalComponent={<EditSpotFormModal details={details} />}
            />
            <div className={classes["delete-icon"]} onClick={deleteSpotHandler}>
              <img alt="" src={deleteIcon} />
            </div>
          </div>
        )}
      </li>
    </>
  );
};

export default OwnedSpotItem;

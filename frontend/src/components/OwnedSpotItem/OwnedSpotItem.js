import OpenModalButton from "../OpenModalButton";
import EditSpotFormModal from "../EditSpotFormModal/EditSpotFormModal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as spotsActions from "../../store/spots";
import classes from "./OwnedSpotItem.module.css";
import deleteIcon from "../../icons/delete.png";
import { Link } from "react-router-dom";

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

  let liStyle;
  if(isChecked) {
    liStyle = {
      backgroundColor: "rgb(244, 209, 209)"
    }
  }

  return (
    <>
      <li
        style={liStyle}
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
            <Link to={`/spots/${details.id}`} className={classes["owned-spot-img"]}>
              <img alt="" src={details.previewImage} />
            </Link>
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

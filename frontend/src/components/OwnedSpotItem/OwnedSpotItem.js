import { useDispatch } from "react-redux";
import { useState } from "react";
import * as spotsActions from "../../store/spots";
import classes from "./OwnedSpotItem.module.css";
import deleteIcon from "../../icons/trash.png";
import OpenModalTr from "../OpenModalTr/OpenModalTr";
import EditSpotForm from "../EditSpotForm/EditSpotForm";
const OwnedSpotItem = ({ details, handleCheckboxChange }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteSpotHandler = (e) => {
    e.stopPropagation();
    dispatch(spotsActions.deleteSpot(details.id)).catch(async (res) => {
      const data = await res.json();
      dispatch(spotsActions.setMessage(data.message));
    });
  };

  let liStyle;
  if (isChecked) {
    liStyle = {
      backgroundColor: "rgb(244, 209, 209)",
    };
  }

  return (
    <OpenModalTr
      className="owned-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={liStyle}
      modalComponent={<EditSpotForm details={details} />}
    >
      <td>
        <div className={classes["checkbox-owned-spot"]}>
          <input
            type="checkbox"
            value={details.id}
            onClick={(e) => {
              e.stopPropagation();
              handleCheckboxChange(e);
              setIsChecked(!isChecked)
            }}
          />
          <div className={classes["owned-spot-img"]}>
            <img alt="" src={details.previewImage} />
          </div>
          <div>
            <strong>in {details.country}</strong>
          </div>
        </div>
      </td>
      <td className={classes.location}>
        <div>{details.address}</div>
        <div>{`${details.city}, ${details.state}`}</div>
      </td>
      <td className={classes.name}>
        <strong>{details.name}</strong>
      </td>
      <td>${details.price}</td>
      <td>{details.avgRating ? details.avgRating : <p>New</p>}</td>
      <td>{details.Bookings?.length ? details.Bookings.length : <p>0</p>}</td>
      <td className={classes["delete-row"]}>
      {isHovered && (

          <img
            className={classes["delete-icon"]}
            onClick={deleteSpotHandler}
            alt=""
            src={deleteIcon}
          />

      )}
      </td>
    </OpenModalTr>
  );
};

export default OwnedSpotItem;

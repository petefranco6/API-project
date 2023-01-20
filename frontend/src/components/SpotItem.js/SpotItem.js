import { Link } from "react-router-dom";
import classes from "./SpotItem.module.css";

const SpotItem = ({ details }) => {
  return (
    <Link to={`/spots/${details.id}`} className={classes.card}>
      <img
        alt=""
        className={classes["card-img"]}
        src={details.previewImage}
      ></img>
      <div className={classes.title}>
        <p className={classes.thick}>{`${details.city}, ${details.state}`}</p>
        <div className={classes.rating}>
          {details.avgRating && <i className="fa-solid fa-star"></i>}
          <div>{details.avgRating}</div>
        </div>
      </div>
      <div className={classes.description}>{details.description}</div>
      <div className={classes.price}>
        <strong>${details.price}</strong> per night
      </div>
    </Link>
  );
};

export default SpotItem;

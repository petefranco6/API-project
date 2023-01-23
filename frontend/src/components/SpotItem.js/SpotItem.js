import { Link } from "react-router-dom";
import classes from "./SpotItem.module.css";

const SpotItem = ({ details }) => {

  let stars;

  if(details.avgRating) {
    stars = details.avgRating.toFixed(1);
  }

  return (
    <Link to={`/spots/${details.id}`} className={classes.card}>
      <div className={classes["img-container"]}>
      <img
        alt=""
        className={classes["card-img"]}
        src={details.previewImage}
      />
      </div>
      <div className={classes.title}>
        <p className={classes.thick}>{`${details.city}, ${details.state}`}</p>
        <div className={classes.rating}>
          {details.avgRating && <i className="fa-solid fa-star"></i>}
          <div>{stars}</div>
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
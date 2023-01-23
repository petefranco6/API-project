import { Link } from "react-router-dom";
import classes from "./SpotItem.module.css";

const SpotItem = ({ details }) => {
  let stars;

  if (details.avgRating) {
    stars = Math.round(parseInt(details.avgRating) * 1e8) / 1e8;
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
      <div className={classes["card-spot-content"]}>
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
      </div>
    </Link>
  );
};

export default SpotItem;

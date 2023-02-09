import { Link } from "react-router-dom";
import classes from "./SpotItem.module.css";
import star from "../../icons/star.png";

const SpotItem = ({ details }) => {
  let stars;

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
            {details.avgRating && <img alt="" src={star} />}
            <div>{stars}</div>
          </div>
        </div>
        <div className={classes.name}>{details.name}</div>
        <div className={classes.miles}>{getRandomIntInclusive(10,1000)} miles away</div>
        <div className={classes.price}>
          <strong>${details.price}</strong> night
        </div>
      </div>
    </Link>
  );
};

export default SpotItem;

// frontend/src/components/Navigation/index.js
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import classes from "./index.module.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <NavLink exact to="/">
        <img
          className={classes.home}
          alt=""
          src="https://pbs.twimg.com/media/Bsure9HIEAAZ48G.png"
        ></img>
      </NavLink>
      <div className={classes["nav-right"]}>
        {sessionUser && (
          <Link className={classes.host} to="/hosting">
            Airbnb your home
          </Link>
        )}
        {!sessionUser && (
          <OpenModalButton
            className="host"
            buttonText="Airbnb your home"
            modalComponent={<LoginFormModal />}
          />
        )}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </nav>
  );
}

export default Navigation;

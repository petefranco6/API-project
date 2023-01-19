// frontend/src/components/Navigation/index.js
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import classes from "./index.module.css";

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
      <ul>
        <li>
          <NavLink to="/hosting">Airbnb your home</NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;

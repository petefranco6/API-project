// frontend/src/components/SignupFormPage/index.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import classes from "./index.module.css";
import close from "../../icons/close.png";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit}>
        <div className={classes.header}>
          <h3>Sign Up</h3>
          <img
            alt=""
            src={close}
            className={classes["close-icon"]}
            onClick={closeModal}
          />
        </div>
        <div className={classes.divider}></div>
        {errors.length > 0 && (
          <ul className={classes["errors-list"]}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}

        <div className={classes.name}>
          <div className={classes["input-container"]}>
            <input
              id="first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="first">First Name</label>
          </div>
          <div className={classes["input-container"]}>
            <input
              className={isFilled ? classes.filled : ""}
              id="last"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setIsFilled(e.target.value.length > 0);
              }}
              required
            />
            <label htmlFor="last">Last Name</label>
          </div>
        </div>
        <div className={classes.credentials}>
          <div className={classes["input-container"]}>
            <input
              className={classes.username}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className={classes["input-container"]}>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className={classes.password}>
          <div className={classes["input-container"]}>
            <input
              className={classes.password1}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className={classes["input-container"]}>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirm-password">Confirm Password</label>
          </div>
        </div>
        <button className={classes.signup} type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;

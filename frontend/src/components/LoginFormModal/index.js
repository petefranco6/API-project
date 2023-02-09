import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import classes from "./index.module.css";
import close from "../../icons/close.png";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLoginHandler = () => {
    dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(closeModal);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes["form-container"]}>
        <div className={classes.header}>
          <h3>Log In</h3>
          <img
            alt=""
            src={close}
            className={classes["close-icon"]}
            onClick={closeModal}
          />
        </div>
        <div className={classes.divider}></div>

        <ul className={classes["errors-list"]}>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className={classes["input-container"]}>
          <input
            id="email-username"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <label htmlFor="email-username">Email or Username</label>
        </div>
        <div className={classes["input-container"]}>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className={classes.login} type="submit">
          Log In
        </button>
        <button
          type="button"
          className={classes.login}
          onClick={demoLoginHandler}
        >
          Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;

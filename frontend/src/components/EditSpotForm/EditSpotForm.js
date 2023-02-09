import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spots";
import classes from "./EditSpotForm.module.css";
import close from "../../icons/close.png";

function EditSpotForm({ details }) {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(details.address);
  const [city, setCity] = useState(details.city);
  const [state, setState] = useState(details.state);
  const [country, setCountry] = useState(details.country);
  const [description, setDescription] = useState(details.description);
  const [name, setName] = useState(details.name);
  const [price, setPrice] = useState(details.price);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    dispatch(
      spotsActions.updateSpot({
        address,
        city,
        state,
        country,
        description,
        name,
        price,
        id: details.id,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          console.log("message");
        }
      });
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <div className={classes.header}>
        <h3>Edit Listing</h3>
        <img
          alt=""
          src={close}
          className={classes["close-icon"]}
          onClick={closeModal}
        />
      </div>
      <div className={classes.divider}></div>
      {errors.length > 0 && (
        <ul className={classes["error-list"]}>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
      <div className={classes["edit-input-container"]}>
        <input
          id="address"
          value={address}
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label htmlFor="address">Address</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label htmlFor="city">City</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="state"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label htmlFor="state">State</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <label htmlFor="country">Country</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label htmlFor="description">Description</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="name">Name</label>
      </div>
      <div className={classes["edit-input-container"]}>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label htmlFor="price">Price</label>
      </div>

      <button className={classes.edit} type="submit">
        Edit
      </button>
    </form>
  );
}

export default EditSpotForm;

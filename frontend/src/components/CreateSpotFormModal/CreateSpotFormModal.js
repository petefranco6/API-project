import { useState } from "react";
import * as spotsActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import classes from "./CreateSpotFormModal.module.css";
import close from "../../icons/close.png";

function CreateSpotFormModal() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      spotsActions.createSpot({
        address,
        city,
        state,
        country,
        description,
        name,
        price,
        url,
        preview: true,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.errors) setErrors(data.errors);
      });
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit}>
        <div className={classes.header}>
          <h3>Add Listing</h3>
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

        <div className={classes["add-input-container"]}>
          <input
            id="address"
            value={address}
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <label htmlFor="address">Address</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <label htmlFor="city">City</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <label htmlFor="state">State</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <label htmlFor="country">Country</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <label htmlFor="price">Price</label>
        </div>
        <div className={classes["add-input-container"]}>
          <input
            id="url"
            alt=""
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <label htmlFor="url">Image Url</label>
        </div>
        <button className={classes.create} type="submit">
          Create
        </button>
      </form>
    </>
  );
}

export default CreateSpotFormModal;

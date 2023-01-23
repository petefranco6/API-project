// frontend/src/components/SignupFormPage/index.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spots";
import classes from "./EditSpotFormModal.module.css";
import close from "../../icons/close.png";
function EditSpotFormModal({ details }) {
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
    return dispatch(
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
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit}>
        <div className={classes.header}>
          <img alt="" src={close} className={classes["close-icon"]} />
          <h3>Edit Listing</h3>
        </div>
        <div className={classes.divider}></div>
        {errors.length > 0 && (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button className={classes.edit} type="submit">Edit</button>
      </form>
    </>
  );
}

export default EditSpotFormModal;

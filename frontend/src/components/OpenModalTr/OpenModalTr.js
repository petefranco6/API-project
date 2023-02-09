import { useModal } from '../../context/Modal';
import classes from "./OpenModalTr.module.css";

function OpenModalTr({
  modalComponent, // component to render inside the modal
  onDivClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className,
  onMouseEnter,
  onMouseLeave,
  style,
  children
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onDivClick === 'function') onDivClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <tr style={style} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} className={classes[className]} onClick={onClick}>{children}</tr>
  );
}

export default OpenModalTr;

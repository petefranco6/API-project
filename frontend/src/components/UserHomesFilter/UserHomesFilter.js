import classes from "./UserHomesFilter.module.css";

const UserHomesFilter = () => {
    return(
        <div className={classes.filter}>
            <div>
                Listing
            </div>
            <div>
                Name
            </div>
            <div>
                Address
            </div>
            <div>
                Average Rating
            </div>
            <div>
                Price
            </div>
            <div>
                Current Bookings
            </div>
        </div>
    );
}

export default UserHomesFilter;

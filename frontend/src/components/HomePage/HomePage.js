import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";

const HomePage = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spots.spots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div>
            <ul>
                {allSpots.map(spot => <li key={spot.id}>{spot.name}</li>)}
            </ul>
        </div>
    );
}

export default HomePage;

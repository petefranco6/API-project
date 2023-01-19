import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Navigation from "./components/Navigation";
import SpotDetailsPage from "./components/SpotDetailsPage/SpotDetailsPage";
import UserHomesPage from "./components/UserHomesPage/UserHomesPage";
import UserBookingsPage from "./components/UserBookingsPage/UserBookingsPage";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetailsPage />
          </Route>
          <Route path="/hosting">
            <UserHomesPage />
          </Route>
          <Route path="/trips">
            <UserBookingsPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

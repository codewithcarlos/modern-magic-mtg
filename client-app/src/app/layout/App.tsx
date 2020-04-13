import React, { Fragment, useContext, useEffect } from "react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import "./styles.css";
import LandingPage from "../../features/landing/LandingPage";
import MetagamePage from "../../features/metagame/MetagamePage";
import PlaytestPage from "../../features/playtest/PlaytestPage";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position={"bottom-right"} />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <div className="activities-container-desktop activities-container-mobile">
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <PrivateRoute
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path="/profile/:username"
                  component={ProfilePage}
                />
                <Route path="/landing" component={LandingPage} />
                <Route path="/metagame" component={MetagamePage} />
                <Route
                  path="/format/:deckID/playtest"
                  component={PlaytestPage}
                />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));

import "./App.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import "firebase/storage";

import { OrganizationContext, Organization } from "./app/model";
import { routes } from "./app/routing";
import ThemeProvider from "./app/component/ThemeProvider";
import { Dashboard } from "./app/page";
import {
  ErrorLanding,
  MissionCreate,
  MissionsCompleted,
  MissionsCreated,
  MissionFeedback,
} from "./app/page";
import AboutPage from "./app/page/Aboutus";
import HomePage from "./app/page/Home";
import LoginPage from "./app/page/Login";
import MissionDetails from "./app/page/MissionDetails";
import OrganizerSignupPage from "./app/page/OrganizerSignup";
import RequestPage from "./app/page/Request";
import SignupScene from "./app/page/Signup";
import Status from "./app/page/Status";
import Snackbar from "./app/component/Snackbars";
import UserProfile from "./app/page/UserProfile";
import DonationPage from "./app/page/Donate";
import theme from "./theme";
import { LinearProgress } from "@material-ui/core";

function PrivateRoute({ children, ...rest }) {
  const auth = useSelector((state) => state.firebase.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: routes.login,
              state: { referrer: location, warning: true },
            }}
          />
        )
      }
    />
  );
}

// grab from domain or some service
const ORGANIZATION_ID = "1";

function App() {
  const [org, setOrg] = useState();
  useEffect(() => {
    Organization.init(ORGANIZATION_ID)
      .then((org) => setOrg(org))
      .catch((error) => {
        console.error(error);
        setOrg(null);
      });
  }, []);

  if (org === undefined) {
    return <LinearProgress />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <OrganizationContext.Provider value={org}>
              <Snackbar.Context.SnackbarProvider>
                {org === null && <Redirect to={routes.organizer.signup} />}
                <Switch>
                  <Route exact path={routes.home} component={HomePage} />
                  <Route path={routes.about} component={AboutPage} />
                  <Route path={routes.login} component={LoginPage} />
                  <Route path={routes.organizer.signup} component={OrganizerSignupPage} />
                  <Route path={routes.volunteer.status} component={Status} />
                  <Route path={routes.user.signup} component={SignupScene} />
                  <Route path={routes.request.start} component={RequestPage} />
                  <Route path={routes.donate} component={DonationPage} />
                  <Route path={routes.organizer.dashboard.home}>
                    <Dashboard />
                  </Route>
                  <PrivateRoute path={routes.missions.createdByUser}>
                    <MissionsCreated />
                  </PrivateRoute>
                  <PrivateRoute path={routes.missions.createNew}>
                    <MissionCreate />
                  </PrivateRoute>
                  <PrivateRoute path={routes.missions.completed}>
                    <MissionsCompleted />
                  </PrivateRoute>
                  <PrivateRoute path={routes.missions.feedback}>
                    <MissionFeedback />
                  </PrivateRoute>
                  <Route path={routes.missions.details} component={MissionDetails} />
                  <PrivateRoute path={routes.user.profile}>
                    <UserProfile />
                  </PrivateRoute>
                  <Route path="*">
                    <ErrorLanding errorCode={404} />
                  </Route>
                </Switch>
                <Snackbar.Context.SnackbarConsumer>
                  {(value) => {
                    return <Snackbar handleClose={value.closeSnackbar} {...value.snackbar} />;
                  }}
                </Snackbar.Context.SnackbarConsumer>
              </Snackbar.Context.SnackbarProvider>
            </OrganizationContext.Provider>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;

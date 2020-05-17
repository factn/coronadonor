import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { isLoaded } from "react-redux-firebase";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import RoutingService from "../services/RoutingService";
import { UserPermissionsService } from "../../model/permissions";

const loadingStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function AppRoute({ children, component, ...rest }) {
  const classes = loadingStyles();
  const auth = useSelector((state) => state.firebase.auth);
  const [userRole, setUserRole] = useState(null);

  const handleRender = ({ location }) => {
    let routeAccess;
    UserPermissionsService.getUserRole(auth).then((role) => {
      setUserRole(role);
    });
    if (isLoaded(auth) && userRole === UserPermissionsService.role) {
      routeAccess = RoutingService.canAccessRoute(location.pathname);
    }
    if (routeAccess) {
      if (routeAccess.permissionGranted) {
        return component ? React.createElement(component, rest) : children;
      } else {
        return (
          <Redirect
            to={{
              pathname: routeAccess.route,
              state: {
                from: location,
                referrer: location,
                warning: true,
              },
            }}
          />
        );
      }
    } else {
      return (
        <div className={classes.root}>
          <LinearProgress />
        </div>
      );
    }
  };

  return <Route {...rest} render={handleRender} />;
}

AppRoute.propTypes = {
  children: PropTypes.element,
  component: PropTypes.elementType,
};

export default AppRoute;

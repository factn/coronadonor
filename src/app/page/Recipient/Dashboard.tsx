import React, { useEffect, useState } from "react";
import { Typography, Box, Button, makeStyles, Tabs, Tab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Link, useLocation, Redirect, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import { Page } from "../../layout";
import { routes, AppRoute } from "../../routing";
import { User } from "../../model";
import { MissionStatus, MissionInterface } from "../../model/schema";
import RequestsList from "./RequestsList";

const useStyles = makeStyles((theme) => ({
  requestButton: {
    width: "fit-content",
    borderRadius: "2rem",
    position: "fixed",
    bottom: "0",
    right: "0",
    margin: "0 1rem 1rem 0",
  },
  tab: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  tabs: {
    width: "inherit",
  },
}));

const stepMap = (path: any) =>
  ({
    [routes.recipient.dashboard.submitted]: 0,
    [routes.recipient.dashboard.completed]: 1,
  }[path] || 0);

const sortByDate = (a: MissionInterface, b: MissionInterface) =>
  new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();

const completedStatus = [MissionStatus.delivered, MissionStatus.succeeded];

export default function () {
  const classes = useStyles();
  const location = useLocation();
  // @ts-ignore no types for state
  const auth = useSelector((state) => state.firebase.auth);
  const [missions, setMissions] = useState<{
    submitted: MissionInterface[];
    completed: MissionInterface[];
  }>({ submitted: [], completed: [] });

  useEffect(() => {
    User.getAllRequestedMissions(auth.uid).then((missions) => {
      let submitted: MissionInterface[] = [];
      let completed: MissionInterface[] = [];

      missions.forEach((mission) => {
        completedStatus.includes(mission.status)
          ? completed.push(mission)
          : submitted.push(mission);
      });

      submitted.sort(sortByDate);
      completed.sort(sortByDate);

      setMissions({ submitted, completed });
    });
  }, [auth.uid]);

  if (location.pathname === routes.recipient.dashboard.home) {
    return <Redirect to={routes.recipient.dashboard.submitted} />;
  }

  return (
    <Page
      appbar={
        <Typography variant="h1" color="textPrimary">
          Requests
        </Typography>
      }
    >
      <Tabs
        variant="fullWidth"
        className={classes.tabs}
        indicatorColor="primary"
        value={stepMap(location.pathname)}
      >
        <Tab
          label={
            <Link to={routes.recipient.dashboard.submitted} className={classes.tab}>
              submitted ({missions.submitted.length})
            </Link>
          }
        ></Tab>
        <Tab
          label={
            <Link to={routes.recipient.dashboard.completed} className={classes.tab}>
              completed ({missions.completed.length})
            </Link>
          }
        ></Tab>
      </Tabs>
      <Box margin="0 1rem" height="100%">
        <Switch>
          <AppRoute path={routes.recipient.dashboard.submitted}>
            {missions.submitted.length ? (
              <RequestsList missions={missions.submitted} />
            ) : (
              <Typography align="center" variant="body1" color="textSecondary">
                You have not submitted any requests
              </Typography>
            )}
          </AppRoute>
          <AppRoute path={routes.recipient.dashboard.completed}>
            {missions.completed.length ? (
              <RequestsList missions={missions.completed} />
            ) : (
              <Typography align="center" variant="body1" color="textSecondary">
                No requests have been completed
              </Typography>
            )}
          </AppRoute>
        </Switch>
      </Box>
      <Button
        className={classes.requestButton}
        size="large"
        variant="contained"
        color="primary"
        startIcon={<Add />}
        component={Link}
        to={routes.request.start}
      >
        NEW REQUEST
      </Button>
    </Page>
  );
}

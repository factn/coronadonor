import React from "react";
import clsx from "clsx";
import { Switch, Route } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

import { makeStyles } from "@material-ui/core/styles";
import Appbar from "./Appbar";
import Drawer from "./Drawer";
import Home from "./Home";
import DashboardMissions from "./Missions";
import { Mission } from "../model";

import HomeIcon from "@material-ui/icons/Home";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import PeopleIcon from "@material-ui/icons/People";
import PanToolIcon from "@material-ui/icons/PanTool";

const useStyles = makeStyles((theme) => ({
  root: {
    // the padding accounted for left menu and top header
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
  },
  contentShift: {
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(6),
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: "auto",
  },
}));

/**
 * Component for controlling missions status
 *
 * @component
 */
const MissionsPage = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useFirestoreConnect(() => [
    Mission.fsInProposed,
    Mission.fsInPlanning,
    Mission.fsInProgress,
    Mission.fsInDone,
    { collection: "users" },
  ]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // this should be async
  const drawerItems = [
    {
      text: "Home",
      id: "/dashboard",
      route: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      text: "Missions",
      id: "/dashboard/missions",
      route: "/dashboard/missions?view=inProposed",
      icon: <AnnouncementIcon />,
    },
    {
      text: "Recipients",
      id: "/dashboard/recipients",
      route: "/dashboard/recipients",
      icon: <PeopleIcon />,
    },
    {
      text: "Volunteers",
      id: "/dashboard/volunteers",
      route: "/dashboard/volunteers",
      icon: <PanToolIcon />,
    },
  ];

  return (
    <div className={classes.root}>
      <Appbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        drawerItems={drawerItems}
        role="navigation"
      />
      <main
        container
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Switch>
          <Route path="/dashboard/missions" component={DashboardMissions} />
          <Route path="/dashboard/" component={() => <Home />} />
        </Switch>
      </main>
    </div>
  );
};

export default MissionsPage;

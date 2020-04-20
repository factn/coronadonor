import React from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { useStyles } from "./NavigationDrawer.style";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToApp from "@material-ui/icons/ExitToApp";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import PanTool from "@material-ui/icons/PanTool";
import { Link, useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";

import { PrivateComponent } from "../../component";
import OrganizerComponent from "../../component/OrganizerComponent";
import { ListItemIcon } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import DashboardIcon from "@material-ui/icons/Dashboard";

const PrivateDrawerButton = ({ children, classes, text, to }) => (
  <PrivateComponent>
    <Link to={to} className={classes.link}>
      <ListItem button>
        <ListItemIcon>{children}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </Link>
  </PrivateComponent>
);

export default function TemporaryDrawer() {
  const firebase = useFirebase();
  const history = useHistory();
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSignOut = () => {
    firebase.logout();
    history.push("/");
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <OrganizerComponent>
          <Link to="/dashboard" className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon classes={{ root: classes.colorIcon }} fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
        </OrganizerComponent>

        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon classes={{ root: classes.colorIcon }} fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link to="/missions" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon classes={{ root: classes.colorIcon }} fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Volunteer needed" />
          </ListItem>
        </Link>
        <PrivateComponent>
          <Link to="/missions/new" className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <AddIcon classes={{ root: classes.colorIcon }} fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Create Mission" />
            </ListItem>
          </Link>
        </PrivateComponent>
        <PrivateComponent>
          <Link to="/missions/created" className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon classes={{ root: classes.colorIcon }} fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="My Requests" />
            </ListItem>
          </Link>
        </PrivateComponent>
        <PrivateComponent>
          <Link to="/status" className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                <EmojiPeopleIcon classes={{ root: classes.colorIcon }} fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="My Status" />
            </ListItem>
          </Link>
        </PrivateComponent>
        <PrivateDrawerButton classes={classes} to="/user/profile" text="User Profile">
          <AccountCircleIcon classes={{ root: classes.colorIcon }} fontSize="large" />
        </PrivateDrawerButton>

        <PrivateComponent>
          <ListItem button onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToApp classes={{ root: classes.colorIcon }} fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Signout" />
          </ListItem>
        </PrivateComponent>
      </List>
    </div>
  );

  const anchor = "right";
  return (
    <React.Fragment key={anchor}>
      <Button
        aria-label="Menu"
        classes={{ root: classes.root, label: classes.label }}
        onClick={toggleDrawer(anchor, true)}
      >
        <MenuIcon fontSize="large" />
      </Button>
      <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
        {list(anchor)}
      </Drawer>
    </React.Fragment>
  );
}

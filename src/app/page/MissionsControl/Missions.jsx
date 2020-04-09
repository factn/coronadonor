import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
//import Appbar from "./Appbar";
import Drawer from "./Drawer";
import MissionCard from "./MissionCard";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  preview: {
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer({
  missionsNotStarted,
  missionsQueued,
  missionsInProgress,
  missionsPending,
  missionsFinished,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  /*const handleDrawerOpen = () => {
    setOpen(true);
  };*/

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      {/*<Appbar open={open} handleDrawerOpen={handleDrawerOpen} />*/}
      <Drawer open={open} handleDrawerClose={handleDrawerClose} />

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Grid container>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} variant="outlined" className={classes.preview}>
              <Typography variant="h3" component="h3">
                Missions not started
              </Typography>
              <Container>
                {missionsNotStarted?.map((mission) => (
                  <Container fixed>
                    <MissionCard mission={mission} key={`preview-${mission.id}`} />
                  </Container>
                ))}
              </Container>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} variant="outlined" className={classes.preview}>
              <Typography variant="h3" component="h3">
                Missions queued
              </Typography>
              {missionsQueued?.map((mission) => (
                <Container fixed>
                  <MissionCard mission={mission} key={`preview-${mission.id}`} />
                </Container>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} variant="outlined" className={classes.preview}>
              <Typography variant="h3" component="h3">
                Missions In Progress
              </Typography>
              {missionsInProgress?.map((mission) => (
                <Container fixed>
                  <MissionCard mission={mission} key={`preview-${mission.id}`} />
                </Container>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} variant="outlined" className={classes.preview}>
              <Typography variant="h3" component="h3">
                Missions Pending
              </Typography>
              <Container>
                {missionsPending?.map((mission) => (
                  <Container fixed>
                    <MissionCard mission={mission} key={`preview-${mission.id}`} />
                  </Container>
                ))}
              </Container>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} variant="outlined" className={classes.preview}>
              <Typography variant="h3" component="h3">
                Missions Finished
              </Typography>
              {missionsFinished?.map((mission) => (
                <Container fixed>
                  <MissionCard mission={mission} key={`preview-${mission.id}`} />
                </Container>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

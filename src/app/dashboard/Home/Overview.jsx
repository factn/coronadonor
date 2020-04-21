import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import React from "react";
import { connect } from "react-redux";

import { color } from "../../../theme";
import { Mission } from "../../model";
import OverviewItem from "./OverviewItem";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  overview: {
    width: "400px",
    height: "160px",
  },
  icon: {
    fontSize: 40,
  },
}));

const Overview = ({ inPlanning, inProgress, inProposed }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} direction="column">
      <Grid item container spacing={2}>
        <Grid item>
          <Card className={classes.overview}>
            <OverviewItem
              icon={<AnnouncementIcon className={classes.icon} style={{ fill: color.darkPink }} />}
              title="Proposed Missions"
              nbr={inProposed.length}
              linkLabel="View Unassigned Missions"
              link="/dashboard/missions?view=inProposed"
              textColor={color.darkPink}
            />
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.overview}>
            <OverviewItem
              icon={
                <AnnouncementIcon className={classes.icon} style={{ fill: color.darkOrange }} />
              }
              title="Planning Missions"
              nbr={inPlanning.length}
              linkLabel="View Queued Missions"
              link="/dashboard/missions?view=inPlanning"
              textColor={color.darkOrange}
            />
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.overview}>
            <OverviewItem
              icon={
                <AnnouncementIcon className={classes.icon} style={{ fill: color.deepPurple }} />
              }
              title="Missions In Progress"
              nbr={inProgress.length}
              linkLabel="View Queued Missions"
              link="/dashboard/missions?view=inProgress"
              textColor={color.darkOrange}
            />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.firebase.auth,
    inProposed: Mission.selectInProposed(state),
    inPlanning: Mission.selectInPlanning(state),
    inProgress: Mission.selectInProgress(state),
  };
};

export default connect(mapStateToProps)(Overview);

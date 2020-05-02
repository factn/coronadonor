import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import { connect } from "react-redux";

import Select from "@material-ui/core/Select";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PanToolIcon from "@material-ui/icons/PanTool";
import clsx from "clsx";
import React, { useState, useReducer } from "react";

import Mission from "../../model/Mission";
import _ from "../../utils/lodash";
import TentativeStatusAction from "./component/TentativeStatusAction";
import AssignedVolunteerPopover from "./component/AssignedVolunteerPopover";
import MissionItemMenu from "./component/MissionItemMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    backgroundColor: "white",
    borderBottom: "1px solid lightgrey",
    padding: theme.spacing(1),
  },
  isSelected: {
    borderColor: theme.palette.primary.main,
  },
  MenuRightWrapper: {
    top: theme.spacing(1),
    right: theme.spacing(1),
    cursor: "pointer",
    position: "absolute",
  },
  link: {
    textDecoration: "underline",
    color: theme.color.black,
  },
}));

/** BEGIN ACTION*/
const unassignedOptions = [
  {
    value: Mission.FundedStatus.fundedbyrecipient,
    text: "Funded By Recipient",
  },
  {
    value: Mission.FundedStatus.fundedbydonation,
    text: "Funded By Donation",
  },
  {
    value: Mission.FundedStatus.fundingnotneeded,
    text: "Funding Not Needed",
  },
];
const NotFundedStatus = ({ classes, missionId }) => {
  const handleChange = (event) => {
    event.preventDefault();
    Mission.update(missionId, {
      fundedStatus: event.target.value,
      status: Mission.Status.tentative,
    });
  };
  return (
    <FormControl className={classes.formControl}>
      <Select
        native
        onChange={handleChange}
        variant="outlined"
        value="Not Yet Funded"
        inputProps={{
          name: "funded",
          id: "select-funded",
        }}
      >
        <option value="none" hidden aria-label="None">
          Not Yet Funded
        </option>
        {unassignedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

const Action = ({ boxRef, classes, mission }) => {
  let { status } = mission;

  if (status === Mission.Status.unassigned) {
    return <NotFundedStatus mission={mission} classes={classes} />;
  }

  return null;
};
/** END ACTION*/

const Row = ({ children, Icon }) => {
  return (
    <Grid item container spacing={1}>
      <Grid item>{Icon && <Icon color="primary" />}</Grid>
      <Grid item xs>
        {children}
      </Grid>
    </Grid>
  );
};
const LocationRow = ({ label, location }) => {
  if (!location) return null;
  return (
    <>
      <Box width="100%">
        <b>{label}</b>
      </Box>
      <Row Icon={LocationOnIcon}>{_.get(location, "address")}</Row>
    </>
  );
};

const VolunteerRow = ({ boxRef, classes, mission, volunteers }) => {
  const [openAssignVolunteerPopover, setOpenAssignVolunteerPopover] = useState(false);

  const { tentativeVolunteerDisplayName, volunteerDisplayName } = mission;
  let assigned = "";
  if (volunteerDisplayName) {
    assigned = volunteerDisplayName + " - accepted";
  } else if (tentativeVolunteerDisplayName) {
    assigned = tentativeVolunteerDisplayName + " - tentative";
  } else {
    assigned = (
      <Box
        className={classes.link}
        onClick={() => {
          setOpenAssignVolunteerPopover(true);
        }}
      >
        Assign Volunteer
      </Box>
    );
  }

  return (
    <>
      <b>Volunteer</b>
      <Row Icon={PanToolIcon}>{assigned}</Row>
      <AssignedVolunteerPopover
        open={openAssignVolunteerPopover}
        onClose={() => setOpenAssignVolunteerPopover(false)}
        boxRef={boxRef}
        volunteers={volunteers}
      />
    </>
  );
};

const FoodBoxDetails = ({ details, notes }) => {
  return (
    <>
      <b>Food Box</b>
      {_.get(details, "needs")?.map((box, index) => {
        return (
          <div key={index}>
            {_.get(box, "quantity")} x {_.get(box, "name")}
          </div>
        );
      })}
    </>
  );
};

const MissionListItem = ({
  groups,
  mission,
  selectedMission,
  setSelectedMission,
  toDetailsView,
  volunteers,
}) => {
  const classes = useStyles();
  const { missionDetails, type } = mission;

  const boxRef = React.useRef(null);

  function onClick() {
    setSelectedMission(mission.id);
  }
  let SpecificDetails = null;
  if (type === "foodbox") {
    SpecificDetails = <FoodBoxDetails type={type} details={missionDetails} />;
  }

  const isSelected = selectedMission === mission.id;

  return (
    <Box
      position="relative"
      onClick={onClick}
      className={clsx(classes.root, { [classes.isSelected]: isSelected })}
      ref={boxRef}
      color="primary"
    >
      <MissionItemMenu
        className={classes.MenuRightWrapper}
        boxRef={boxRef}
        groups={groups}
        mission={mission}
      />
      {SpecificDetails}
      <LocationRow label="Pick Up" location={mission.pickUpLocation} />
      <LocationRow label="Drop Off" location={mission.deliveryLocation} />
      <VolunteerRow mission={mission} classes={classes} boxRef={boxRef} />
      <Action mission={mission} classes={classes} boxRef={boxRef} />
      <Box
        onClick={toDetailsView}
        role="button"
        aria-label="To Mission Details View"
        className={classes.link}
      >
        View Mission Details
      </Box>
    </Box>
  );
};
export default connect((state) => ({
  volunteers: state.firestore.ordered.volunteers,
}))(MissionListItem);

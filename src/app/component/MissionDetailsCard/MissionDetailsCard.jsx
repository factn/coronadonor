import React from "react";
import PropTypes from "prop-types";

import { H5, Body2 } from "../";
import {
  Divider,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
} from "@material-ui/core";

import UserPhoneUnverifiedPopup from "../UserPhoneUnverifiedPopup";
import MissionDetailsIconList from "./MissionDetailsIconList";
import { MissionDetailsButton, MissionDetailsUnassignMeButton } from "./MissionDetailsButton";
import MissionDetailsStatus from "./MissionDetailsStatus";

import PersonIcon from "@material-ui/icons/Person";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import cameraImage from "../../../img/placeholderBackground.svg";

import { makeStyles } from "@material-ui/core/styles";

import { Mission } from "../../model";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingBottom: theme.spacing(1),
  },
  cardAction: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  subheader: {
    marginTop: theme.spacing(0.3),
  },
  image: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  missionTypeText: {
    paddingTop: theme.spacing(0.5),
  },
  deliveryDetailsHeader: {
    paddingTop: theme.spacing(1),
    fontWeight: 600,
  },
  deliveryDetails: {
    marginTop: theme.spacing(0.5),
  },
}));

const MissionDetailsType = ({ description, classes }) => (
  <Box>
    <H5 align="left" color="textSecondary">
      Mission Type
    </H5>
    <Body2 align="left" className={classes.missionTypeText} color="textPrimary">
      {description}
    </Body2>
  </Box>
);

const MissionDetailsPickUpDeliveryHeader = ({ header, classes }) => (
  <Body2 align="left" className={classes.deliveryDetailsHeader} color="textPrimary">
    {header}
  </Body2>
);

/**
 * Component for displaying mission details as a card
 *
 * @component
 */
const MissionDetailsCard = ({
  mission,
  volunteer,
  volunteerForMission,
  startMission,
  openMissionDeliveredCard,
  unassignFromMission,
  userUnverifiedPopupOpen,
  setUserUnverifiedPopupOpen,
}) => {
  const classes = useStyles();

  const subheaderItems = [
    {
      icon: mission.status === Mission.Status.unassigned ? PersonIcon : undefined,
      avatar:
        mission.status !== Mission.Status.unassigned
          ? {
              image: volunteer.avatar,
            }
          : undefined,
      content: [
        {
          text: (
            <MissionDetailsStatus status={mission.status} volunteerName={volunteer.profileName} />
          ),
        },
      ],
    },
    {
      icon: AttachMoneyIcon,
      content: [{ text: Mission.FundedStatus[mission.fundedStatus] }],
    },
  ];

  const pickUpDetails = [
    {
      icon: LocationOnIcon,
      content: [{ text: mission.pickUplocation }],
    },
    {
      icon: ScheduleIcon,
      content: [{ text: mission.pickUpWindow }],
    },
  ];

  const deliveryDetails = [
    {
      icon: LocationOnIcon,
      content: [{ text: mission.deliverylocation }],
    },
    {
      icon: ScheduleIcon,
      content: [{ text: mission.deliveryWindow }],
    },
    {
      icon: PersonIcon,
      content: [
        { text: mission.recipientName },
        {
          text: mission.recipientPhoneNumber,
          style: {
            fontWeight: 600,
            textDecoration: "underline",
          },
        },
      ],
    },
  ];

  return (
    <>
      <Card align="left">
        <CardHeader
          title={mission.title}
          titleTypographyProps={{ variant: "h3", component: "span", color: "textPrimary" }}
          subheader={
            <MissionDetailsIconList outerClass={classes.subheader} contentItems={subheaderItems} />
          }
          className={classes.cardHeader}
        />
        <CardMedia image={cameraImage} title="Mission image" className={classes.image} />
        <CardContent className={classes.cardContent}>
          <MissionDetailsType description={mission.description} classes={classes} />
          <MissionDetailsPickUpDeliveryHeader header="Pick Up Details" classes={classes} />
          <MissionDetailsIconList
            outerClass={classes.deliveryDetails}
            contentItems={pickUpDetails}
          />
          <MissionDetailsPickUpDeliveryHeader header="Delivery Details" classes={classes} />
          <MissionDetailsIconList
            outerClass={classes.deliveryDetails}
            contentItems={deliveryDetails}
          />
        </CardContent>
        <Divider />
        <CardActions className={classes.cardAction}>
          <MissionDetailsButton
            status={mission.status}
            volunteerForMission={() => volunteerForMission(mission.id)}
            startMission={() => startMission(mission.id)}
            openMissionDeliveredCard={() => openMissionDeliveredCard(mission.id)}
          />
        </CardActions>
        <CardActions className={classes.cardAction}>
          <MissionDetailsUnassignMeButton
            status={mission.status}
            unassignFromMission={unassignFromMission}
          />
        </CardActions>
      </Card>
      <UserPhoneUnverifiedPopup
        open={userUnverifiedPopupOpen}
        handleClose={() => setUserUnverifiedPopupOpen(false)}
      />
    </>
  );
};

MissionDetailsCard.defaultProps = {
  /**
   * default props for mission object
   */
  mission: {
    title: "",
    status: "",
    fundedStatus: "",
    description: "",
    pickUplocation: "",
    pickUpWindow: "",
    deliverylocation: "",
    deliveryWindow: "",
    recipientName: "",
    recipientPhoneNumber: "",
  },
  /**
   * default props for volunteer object
   */
  volunteer: {
    profileName: "",
    avatar: "",
  },
};

MissionDetailsCard.propTypes = {
  /**
   * Mission details
   */
  mission: PropTypes.object.isRequired,
  /**
   * Volunteer details
   */
  volunteer: PropTypes.object.isRequired,
  /**
   * Handler functions for button
   */
  volunteerForMission: PropTypes.func,
  startMission: PropTypes.func,
  markMissionAsDelivered: PropTypes.func,
  unassignVolunteerFromMission: PropTypes.func,
  /**
   * Popup for unverified user
   */
  userUnverifiedPopupOpen: PropTypes.bool,
  setUserUnverifiedPopupOpen: PropTypes.func,
  /**
   * Navigation history provided by React Router
   */
  history: PropTypes.object.isRequired,
};

export default MissionDetailsCard;

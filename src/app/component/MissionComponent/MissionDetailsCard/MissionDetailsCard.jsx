import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import Snackbar from "../../Snackbars";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Button from "@material-ui/core/Button";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import ImageUpload from "../../ImageUpload";
import FoodBoxIcon from "../../icons/FoodBoxIcon";
import { H2 } from "../../Typography";
import styled from "styled-components";
import { useFirebase } from "react-redux-firebase";
import { Mission } from "../../../model";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "0px !important",
    ...theme.typography.body1,
    width: "100%",
  },
  cardHeader: {
    fontWeight: "bold",
    letterSpacing: "0.5px",
    minHeight: "0px !important",
    "& :first-child": {
      margin: `${theme.spacing(1)} !important`,
    },
  },
  interaction: {
    margin: `${theme.spacing(2)}px 0px`,
    padding: theme.spacing(1),
    backgroundColor: "#e1e2f9",
    color: theme.palette.primary.main,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.2px",
    fontWeight: 600,
  },
  warningIcon: {
    color: theme.color.red,
    marginLeft: theme.spacing(3),
  },
}));

const RowIcon = styled(Grid)`
  padding: 2px 4px 0px 0px;
`;
const Row = ({ children, Icon, label }) => {
  return (
    <>
      <Grid container alignItems="center" className="body-small-bold">
        {label}
      </Grid>
      <Grid container wrap="nowrap">
        <RowIcon item>{Icon}</RowIcon>
        <Grid item xs container alignItems="center">
          {children}
        </Grid>
      </Grid>
    </>
  );
};

const DoneButton = styled(Button)`
  position: absolute;
  bottom: 0;
  right: 0;
`;
const TextRowEditable = ({ disabled, label, onClick, text }) => {
  const [value, setValue] = useState(text);
  const [isEdit, setIsEdit] = useState(false);

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <>
      <Grid container alignItems="center" className="body-small-bold">
        {label}
        {!isEdit && !disabled && (
          <Button startIcon={<EditIcon />} color="primary" onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        )}
      </Grid>
      <Grid container wrap="nowrap">
        <Box width="100%" position="relative">
          {isEdit && !disabled ? (
            <>
              <TextField
                value={value}
                id="pickup-notes"
                multiline
                variant="outlined"
                rows={4}
                fullWidth
                autoFocus
                onChange={handleChange}
              />
              <DoneButton
                color="primary"
                onClick={() => {
                  setIsEdit(false);
                  onClick(value);
                }}
              >
                done
              </DoneButton>
            </>
          ) : (
            text
          )}
        </Box>
      </Grid>
    </>
  );
};
/**
 * Component for displaying mission details as a card
 *
 * @component
 */
const MissionDetailsCard = ({ mission }) => {
  const snackbarContext = useContext(Snackbar.Context.SnackbarContext);
  const firebase = useFirebase();
  const storage = firebase.storage();
  const classes = useStyles();

  const photoDisabled = mission.status !== Mission.Status.started;
  const notesEditDisabled = [Mission.Status.unassigned, Mission.Status.tentative].includes(
    mission.status
  );

  async function handleImageChosen(file) {
    const uploadTask = storage
      .ref(`confirmed_delivery/${file.name}`)
      .put(file)
      .then((data) => {
        return data.ref.getDownloadURL();
      })
      .then((imgURL) => {
        Mission.update(mission.uid, { deliveryConfirmationImage: imgURL });
      })
      .catch((error) => {
        snackbarContext.show({
          message: `Unable to upload image: ${error.message}`,
          type: "error",
        });
      });
    return await uploadTask;
  }
  function updateDeliveryNotes(value) {
    Mission.update(mission.uid, { deliveryNotes: value });
  }
  function updatePickUpNotes(value) {
    Mission.update(mission.uid, { pickUpNotes: value });
  }

  return (
    <>
      <Grid item>
        <H2>Food Box Delivery</H2>
        {mission.details.map((resource) => {
          return (
            <Row key={resource.displayName} Icon={<FoodBoxIcon />}>
              {resource.quantity} X {resource.displayName}
            </Row>
          );
        })}
      </Grid>

      <Grid container item className={classes.interaction}>
        <Grid container item alignItems="center">
          <ErrorOutlineIcon />
          Interaction Guidelines
        </Grid>
        <Grid container item alignItems="center">
          <ClearIcon className={classes.warningIcon} /> Do not exchange cash.
        </Grid>
        <Grid container item alignItems="center">
          <ClearIcon className={classes.warningIcon} /> No physical contact.
        </Grid>
      </Grid>
      <ExpansionPanel defaultExpanded={true} className={classes.card} variant="outlined">
        <ExpansionPanelSummary className={classes.cardHeader} expandIcon={<ExpandMoreIcon />}>
          1. Pick Up Details
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={1}>
            <Row Icon={<ScheduleIcon color="primary" />}>{mission.pickUpWindow.timeWindowType}</Row>
            <Row Icon={<LocationOnIcon color="primary" />}>{mission.pickUpLocation.address}</Row>
            <TextRowEditable
              text={mission.pickUpNotes}
              label="Pick Up Instructions"
              onClick={updatePickUpNotes}
              disabled={notesEditDisabled}
            />
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded={true} className={classes.card} variant="outlined">
        <ExpansionPanelSummary className={classes.cardHeader} expandIcon={<ExpandMoreIcon />}>
          2. Delivery Details
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.card} variant="outlined">
          <Grid container spacing={1}>
            <Row Icon={<ScheduleIcon color="primary" />}>
              {mission.deliveryWindow.timeWindowType}
            </Row>
            <Row Icon={<LocationOnIcon color="primary" />}>{mission.deliveryLocation.address}</Row>
            <TextRowEditable
              text={mission.deliveryNotes}
              onClick={updateDeliveryNotes}
              label="Delivery Instructions"
              disabled={notesEditDisabled}
            />
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel
        disabled={photoDisabled}
        defaultExpanded={photoDisabled ? false : true}
        className={classes.card}
        variant="outlined"
      >
        <ExpansionPanelSummary className={classes.cardHeader} expandIcon={<ExpandMoreIcon />}>
          3. Add Photo of Delivery
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container spacing={1}>
            <Row>
              Help {mission.recipientDisplayName} find the box by taking a photo of where you left
              it.
            </Row>
            <Grid item container justify="center">
              <ImageUpload
                withoutTwoBtns
                getFile={handleImageChosen}
                confirmationImage={mission.deliveryConfirmationImage}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};

MissionDetailsCard.propTypes = {
  mission: PropTypes.object.isRequired,
};

export default MissionDetailsCard;

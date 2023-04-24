import { Box, Container, Grid, Paper, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PanToolIcon from "@material-ui/icons/PanTool";
import PersonIcon from "@material-ui/icons/Person";
import React, { useState } from "react";
import { Button, Body2, H2 } from "../../../component";
import Switch from "@material-ui/core/Switch";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Mission } from "../../../model";
import _ from "../../../utils/lodash";
import AddressInput from "../../../component/AddressInput";
import UsersAutocomplete from "../../../component/UsersAutocomplete";
import GroupAutoComplete from "../component/GroupAutoComplete";
import { useForm } from "../../../hooks";
import { MissionStatus } from "../../../model/schema";
import MissionDetailsRow from "./MissionDetailsRow";
import RecipientInformation from "./RecipientInformation";
import PickupInformation from "./PickupInformation";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    height: "100%",
    overflow: "auto",
    padding: `0px ${theme.spacing(1)}px`,
  },
  image: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  missionTypeText: {
    paddingTop: theme.spacing(0.5),
  },
  label: {
    fontWeight: 600,
  },
  rowLabel: {
    fontWeight: 600,
    marginTop: theme.spacing(2),
  },
  deliveryDetails: {
    marginTop: theme.spacing(0.5),
  },
  rowBody: {
    flexWrap: "nowrap",
    alignItems: "center",
    width: "100%",
  },
  textField: {
    width: "100%",
    backgroundColor: "black",
  },
  missionImage: {
    margin: theme.spacing(1),
    width: "100%",
    maxHeight: "200px",
  },
  foodBoxDetailContainer: {
    border: "1px solid lightgrey",
    borderRadius: "4px",
    fontSize: "18px",
    color: "black",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  foodBoxDetailQuantity: {
    padding: theme.spacing(1),
    borderRight: "1px solid lightgrey",
  },
  foodBoxDetailName: {
    padding: theme.spacing(1),
  },
  missionInput: {
    width: "100%",
  },
  fullWidth: {
    width: "100%",
  },
}));

/**=====BASE COMPONENTs======**/

const Label = ({ children, classes }) => {
  if (!children) return null;
  return (
    <Body2 align="left" className={classes.rowLabel} color="textPrimary">
      <b>{children}</b>
    </Body2>
  );
};

const Row = ({ children, classes, Icon }) => {
  if (!children) return null;
  return (
    <Grid container className={classes.rowBody}>
      {Icon && (
        <Box marginRight="20px" width="20px">
          <Icon color="primary" />
        </Box>
      )}
      {children}
    </Grid>
  );
};

const Card = ({ children, classes, label }) => {
  if (!children) return null;
  return (
    <>
      <Label classes={classes}>{label}</Label>
      {children}
    </>
  );
};

/**=====ROW COMPONENTS=======*/

const MissionImage = ({ classes, mission }) => {
  const imageUrl = mission?.image;
  if (!imageUrl) return null;

  return (
    <Container>
      <img src={imageUrl} className={classes.missionImage} alt="details" />
    </Container>
  );
};

const MissionStatusRow = ({ classes, mission }) => {
  let status = mission?.status;
  let missionStatusText;
  switch (status) {
    case Mission.Status.unassigned:
      missionStatusText = "Looking for volunteer";
      break;
    default:
      missionStatusText = status;
      break;
  }
  return (
    <Row Icon={PanToolIcon} classes={classes}>
      {missionStatusText}
    </Row>
  );
};

const volunteerStatus = [MissionStatus.unassigned, MissionStatus.tentative, MissionStatus.assigned];

const getVolunteerAttribute = (selectedVolunteer, attr, tentativeClause) => {
  if (selectedVolunteer && tentativeClause) {
    return selectedVolunteer[attr];
  }
  return "";
};

/**
 * Component for editing mission details
 * @component
 */
const MissionEditView = ({ groups, mission, toListView, volunteers }) => {
  const classes = useStyles();

  const { handleChange, values } = useForm(mission);
  const [pickUp, setPickUp] = React.useState({
    time: new Date(),
    date: values?.pickUpWindow?.startTime,
    location: "",
  });
  const [deliveryTime, setDeliveryTime] = React.useState({
    time: new Date(),
    date: values?.deliveryWindow?.startTime,
    location: "",
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(
    volunteers?.find(
      (el) => el.id === mission.volunteerUid || el.id === mission.tentativeVolunteerUid
    )
  );
  const [selectedGroup, setSelectedGroup] = useState(
    groups?.find((el) => el.id === mission?.groupUid)
  );

  const props = { classes, mission };

  const volunteerEditable = volunteerStatus.includes(mission?.status);

  function changeFormValue(name, value) {
    handleChange({ target: { name, value } });
  }

  function handleChangeLocation(data) {
    const { location } = data;
    changeFormValue("location", location);
  }

  function handleChangeReadyToStart(e) {
    changeFormValue("readyToStart", e.target.checked);
  }

  function handleSave(e) {
    e.preventDefault();
    const pickUpTime = new Date(pickUp.date);
    pickUpTime.setHours(pickUp.time.getHours());
    pickUpTime.setMinutes(pickUp.time.getMinutes());
    pickUpTime.setSeconds(pickUp.time.getSeconds());

    const delivery = new Date(deliveryTime.date);
    delivery.setHours(deliveryTime.time.getHours());
    delivery.setMinutes(deliveryTime.time.getMinutes());
    delivery.setSeconds(deliveryTime.time.getSeconds());
    Mission.update(mission.id, {
      pickUpLocation: values.pickUpLocation,
      deliveryLocation: values.deliveryLocation,
      recipientDisplayName: values.recipientDisplayName,
      recipientPhoneNumber: values.recipientPhoneNumber,
      deliveryNotes: values.deliveryNotes,
      pickUpWindow: {
        startTime: pickUpTime.toString(),
      },
      deliveryWindow: {
        startTime: delivery.toString(),
      },
      groupUid: selectedGroup ? selectedGroup.id : "",
      groupDisplayName: selectedGroup ? selectedGroup.displayName : "",
      volunteerUid: getVolunteerAttribute(
        selectedVolunteer,
        "id",
        values.status !== MissionStatus.tentative
      ),
      volunteerDisplayname: getVolunteerAttribute(
        selectedVolunteer,
        "displayName",
        values.status !== MissionStatus.tentative
      ),
      volunteerPhoneNumber: getVolunteerAttribute(
        selectedVolunteer,
        "phoneNumber",
        values.status !== MissionStatus.tentative
      ),
      tentativeVolunteerUid: getVolunteerAttribute(
        selectedVolunteer,
        "id",
        values.status === MissionStatus.tentative
      ),
      tentativeVolunteerDisplayName: getVolunteerAttribute(
        selectedVolunteer,
        "displayName",
        values.status === MissionStatus.tentative
      ),
      tentativeVolunteerPhoneNumber: getVolunteerAttribute(
        selectedVolunteer,
        "phoneNumber",
        values.status === MissionStatus.tentative
      ),
      readyToStart: values.readyToStart,
    }).then((result) => {});
  }

  return (
    <Box height="100%" width="100%">
      <Paper className={classes.root} elevation={0}>
        <Box position="relative" textAlign="center" paddingTop="2rem">
          <Box onClick={toListView} position="absolute">
            <ArrowBackIcon />
          </Box>
          <H2>Mission Details</H2>
        </Box>

        <Box>
          <MissionImage {...props} />
          <MissionDetailsRow {...props} />
          <Box>
            <RecipientInformation {...props} />
            <PickupInformation {...props} />
          </Box>

          <Card label="Pick Up Details" classes={classes}>
            <Row Icon={ScheduleIcon} classes={classes}></Row>
            <Grid
              container
              direction="row"
              alignItems="top"
              spacing={1}
              className={classes.fullWidth}
            >
              <Grid item>
                <LocationOnIcon />
              </Grid>
              <Grid item style={{ width: "90%" }}>
                <Grid container direction="column" alignItems="center">
                  <Grid item className={classes.fullWidth}>
                    <TextField
                      className={`${classes.rootInput} ${classes.input}`}
                      id="pickupLocation.label"
                      name="pickupLocation.label"
                      value={values.pickUpLocationLabel}
                      placeholder="Location Name"
                      variant="outlined"
                      disabled={false}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item className={classes.fullWidth}>
                    <AddressInput
                      className={classes.textField}
                      id="pickup-address-id"
                      placeholder={values.pickUpLocation?.address}
                      stage={values.pickUpLocation}
                      setStage={handleChangeLocation.bind(null, "pickUpLocation")}
                      setLocation={handleChangeLocation}
                      value={values.pickUpLocation?.address}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Card label="Delivery Details" classes={classes}>
            <Row Icon={ScheduleIcon} classes={classes}>
              >
            </Row>
            <Row Icon={LocationOnIcon} classes={classes}>
              <Grid container direction="row">
                <Grid item className={classes.fullWidth}>
                  <AddressInput
                    className={classes.textField}
                    id="delivery-address-id"
                    placeholder={values.deliveryLocation?.address}
                    stage={values.deliveryLocation}
                    setStage={handleChangeLocation.bind(null, "deliveryLocation")}
                    setLocation={handleChangeLocation}
                    value={values.deliveryLocation?.address}
                  />
                </Grid>
              </Grid>
            </Row>
            <Grid container direction="row" alignItems="top" spacing={1}>
              <Grid item>
                <PersonIcon />
              </Grid>
              <Grid item style={{ width: "90%" }}>
                <Grid container direction="column" alignItems="center">
                  <Grid item className={classes.fullWidth}>
                    <TextField
                      className={`${classes.rootInput} ${classes.input}`}
                      id="recipientDisplayName"
                      name="recipientDisplayName"
                      value={values.recipientDisplayName}
                      placeholder="Recipient"
                      variant="outlined"
                      disabled={false}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item className={classes.fullWidth}>
                    <TextField
                      className={`${classes.rootInput} ${classes.input}`}
                      id="recipientPhoneNumber"
                      name="recipientPhoneNumber"
                      value={values.recipientPhoneNumber}
                      placeholder="Phone Number"
                      variant="outlined"
                      disabled={false}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          <Card label="Volunteer Information" classes={classes}>
            <UsersAutocomplete
              editable={volunteerEditable}
              handleChange={setSelectedVolunteer}
              users={volunteers}
              selected={selectedVolunteer}
            />
          </Card>

          <Row classes={classes}>
            <Grid container direction="row" spacing={1} className={classes.rowBody}>
              <Grid item>
                <Switch
                  size="normal"
                  name="readyToStart"
                  checked={values.readyToStart}
                  onChange={handleChangeReadyToStart}
                />
              </Grid>
              <Grid item className={classes.label}>
                Ready To Start?
              </Grid>
            </Grid>
          </Row>

          <Card label="Group" classes={classes}>
            <GroupAutoComplete
              classes={classes}
              groups={groups}
              handleChange={setSelectedGroup}
              selected={selectedGroup}
            />
          </Card>

          <Label classes={classes}>Delivery Notes</Label>
          <Row classes={classes}>
            <TextField
              variant="outlined"
              value={values.deliveryNotes}
              name="deliveryNotes"
              onChange={handleChange}
              placeholder="Notes"
              multiline
              className={classes.fullWidth}
              rows={4}
            />
          </Row>
          <Box
            style={{
              marginTop: "3rem",
              marginLeft: "1rem",
              display: "flex",
              justifyContent: "center",
              spacing: 1,
            }}
          >
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              style={{ margin: ".5em" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MissionEditView;

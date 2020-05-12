import {
  Checkbox,
  FormControlLabel,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { H2, Body1 } from "../../../component";
import AddressAutocomplete from "../../../component/AddressAutocomplete";
import { useFirebase } from "react-redux-firebase";
import { useStyles, HR } from "./foodboxSteps.style";
import NavigationButtons from "./NavigationButtons";
import { User } from "../../../model";
import { useForm } from "../../../hooks";

function DeliveryStep({ dispatch, state }) {
  const classes = useStyles();
  const profile = useSelector((state) => state.firebase.profile);
  const hasPhoneNumber = !profile.isEmpty && profile.phoneNumber?.length > 0;
  const firebase = useFirebase();
  const { handleChange, values } = useForm();

  useEffect(() => {
    // set initial state of form values
    changeFormValue("location", state.location);
    changeFormValue("instructions", state.instructions);
    // eslint-disable-next-line
  }, []);

  function changeFormValue(name, value) {
    handleChange({ target: { name, value } });
    return value;
  }

  function handleCheckBoxChange(event, value) {
    changeFormValue(event.currentTarget.name, value);
  }

  function handleChangeLocation(data) {
    changeFormValue("location", data);
  }

  async function verifyPhone() {
    dispatch({ type: "LOADING", payload: true });
    let userUid;
    const displayName = `${values.firstName} ${values.lastName}`;
    const phoneNumber = values.phone;

    try {
      if (!!values.cannotReceiveTexts) {
        // This user is created but not connected to any login.
        userUid = await User.createProfile(null, {
          displayName,
          phoneNumber,
          cannotReceiveTexts: true,
        });
      } else {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("phone-number", {
            size: "invisible",
          });
        }

        const verificationPrompt =
          "Please enter the verification code that was sent to your mobile device.";

        let confirmationResult;
        if (profile.isEmpty) {
          confirmationResult = await firebase
            .auth()
            .signInWithPhoneNumber(values.phone, window.recaptchaVerifier);
        } else {
          confirmationResult = await firebase
            .auth()
            .currentUser.linkWithPhoneNumber(values.phone, window.recaptchaVerifier);
        }

        const verificationCode = window.prompt(verificationPrompt);
        const response = await confirmationResult.confirm(verificationCode);

        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }

        userUid = response.user.uid;
        await User.createProfile(userUid, {
          displayName,
          phoneNumber,
          cannotReceiveTexts: !!values.cannotReceiveTexts,
        });
      }

      dispatch({
        type: "UPDATE_DETAILS",
        payload: {
          location: values.location,
          instructions: values.instructions,
          recipient: { uid: userUid, phoneNumber: values.phone, displayName },
        },
      });
    } catch (error) {
      const message =
        error.message === "Invalid format."
          ? 'Phone number provided is invalid format. Please use "+15555555555".'
          : error.message;
      dispatch({ type: "ERROR", payload: message });
    }
  }

  function validateForm() {
    let hasError = false;
    hasError = changeFormValue("locationError", !values.location);
    if (!hasPhoneNumber) {
      hasError = changeFormValue("firstNameError", !values.firstName) || hasError;
      hasError = changeFormValue("lastNameError", !values.lastName) || hasError;
      hasError = changeFormValue("phoneError", !values.phone) || hasError;
      hasError = changeFormValue("tcError", !values.termsAndConditions) || hasError;
    }
    return hasError;
  }

  async function submit() {
    if (validateForm()) {
      dispatch({ type: "ERROR", payload: "Please fill out the required fields" });
      return;
    }

    if (!hasPhoneNumber) {
      return verifyPhone();
    }

    const { displayName, phoneNumber, uid } = profile;

    if (!displayName) {
      dispatch({
        type: "ERROR",
        payload: "No name specified on your account. Please update your user profile.",
      });
      return;
    }

    dispatch({
      type: "UPDATE_DETAILS",
      payload: {
        location: values.location,
        instructions: values.instructions,
        recipient: { uid, phoneNumber, displayName },
      },
    });
  }

  return (
    <div>
      <Body1 className={classes.body1}>
        Our volunteers will carry out deliveries once a week on weekends. The organizer will contact
        you to confirm date of delivery.
      </Body1>
      <H2 align="left" color="textPrimary" gutterBottom>
        Delivery Drop Off Details
      </H2>
      <AddressAutocomplete
        label="Location"
        defaultLocation={values.location}
        onChangeLocation={handleChangeLocation}
        showMap={true}
        error={values.locationError}
        required
      />
      <TextField
        className={classes.textArea}
        fullWidth
        helperText="By default we leave food boxes at your door"
        label="Drop off Instructions / Comments"
        multiline
        name="instructions"
        onChange={handleChange}
        placeholder="Knock loudly, leave in front, etc."
        rows={5}
        value={values.instructions || state.instructions || ""}
        variant="outlined"
      />
      <Body1 className={classes.body1}>
        To help our volunteers fulfill your request, please provide your name and contact mobile
        number.
      </Body1>
      {!hasPhoneNumber && (
        <>
          <H2 align="left" color="textPrimary" gutterBottom>
            Your Account
          </H2>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            onChange={handleChange}
            value={values.firstName || ""}
            variant="outlined"
            required
            error={values.firstNameError}
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Last Name"
            name="lastName"
            onChange={handleChange}
            value={values.lastName || ""}
            variant="outlined"
            required
            error={values.lastNameError}
          />
          <TextField
            className={classes.textField}
            placeholder="+15555555555"
            fullWidth
            helperText="Used for receiving updates (SMS/texts)"
            label="Mobile Number"
            name="phone"
            id="phone-number"
            onChange={handleChange}
            value={values.phone || ""}
            variant="outlined"
            required
            error={values.phoneError}
          />
          <FormControl className={classes.formControl}>
            <FormControlLabel
              className={classes.checkBox}
              control={
                <Checkbox
                  checked={!!values.cannotReceiveTexts}
                  onChange={handleCheckBoxChange}
                  name="cannotReceiveTexts"
                />
              }
              label="I cannot receive SMS/texts"
            />
          </FormControl>
          <HR />
          <FormControl className={classes.formControl} required error={values.tcError}>
            {values.tcError && <FormHelperText>Below checkbox is required</FormHelperText>}
            <FormControlLabel
              className={classes.checkBox}
              control={
                <Checkbox
                  checked={!!values.termsAndConditions}
                  onChange={handleCheckBoxChange}
                  name="termsAndConditions"
                />
              }
              label="By signing up, I agree to some terms and conditions, waiver link here,"
            />
          </FormControl>
        </>
      )}

      <NavigationButtons onBack={() => dispatch({ type: "BACK" })} onNext={submit} />
    </div>
  );
}

export default DeliveryStep;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Page, Card } from "../../layout";
import { Button } from "../../component";
import { Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { useFirebase, useFirestore } from "react-redux-firebase";
import _ from "lodash";

import LinkGoogleAccount from "./LinkGoogleAccount";
import LinkPhoneAccount from "./LinkPhoneAccount";

import UserOverview from "./UserOverview";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(1),
  },
  fullWidth: {
    width: "100%",
  },
  linkedAccountContainer: {
    paddingTop: theme.spacing(2),
  },
}));

const ProfileControlButtons = ({ isEdit, saveAction, cancelAction, editAction }) => {
  return isEdit ? (
    <Grid spacing={2} justify="center" container>
      <Grid item>
        <Button size="large" onClick={saveAction}>
          Save
        </Button>
      </Grid>
      <Grid item>
        <Button size="large" onClick={cancelAction}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  ) : (
    <Button size="large" onClick={editAction}>
      Edit Profile
    </Button>
  );
};

const UserProfile = ({ history }) => {
  const classes = useStyles();
  const firebase = useFirebase();
  const firestore = useFirestore();

  /*===SETUP Profile Control===*/
  const firebaseAuth = useSelector((state) => state.firebase.auth);
  const firebaseProfile = useSelector((state) => state.firebase.profile);
  const [profile, setProfile] = useState(_.cloneDeep(firebaseProfile));
  var [view, setView] = useState("view");
  const isEdit = view !== "view";
  function editProfileAction(e) {
    e.preventDefault();
    setView("edit");
  }
  function cancelProfileAction(e) {
    e.preventDefault();
    setProfile(_.cloneDeep(firebaseProfile));
    setView("view");
  }
  function saveProfileAction(e) {
    e.preventDefault();
    firebase.updateProfile(profile);
    setView("view");
  }
  /*
  Basically if this is a user that have signup using facebook or google, the auth in firebase would be populate with info to which-
  we update the profile into the actual profile instead
  */
  useEffect(() => {
    if (firebaseAuth.isLoaded && firebaseProfile.isLoaded && firebaseProfile.isEmpty) {
      const newProfile = {
        displayName: _.get(firebaseAuth, "displayName", ""),
        photoURL: _.get(firebaseAuth, "photoURL", ""),
      };
      firebase.updateProfile(newProfile);
    }
    // eslint-disable-next-line
  }, [firebaseAuth, firebaseProfile]);

  /*
  firebase profile need to load in and then we update it in state
  */
  useEffect(() => {
    if (firebaseProfile.isLoaded && !firebaseProfile.isEmpty) {
      setProfile(_.cloneDeep(firebaseProfile));
    }
  }, [firebaseProfile]);
  /*===END Profile Control===*/

  /*===SETUP Linking Control===*/
  const user = useSelector((state) => state.firebase.auth);
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const captchaVerifier = firebase.auth.RecaptchaVerifier;

  /* === Linked Account Control === */
  const googleProviderData = _.find(user.providerData, (data) => {
    return data.providerId === "google.com";
  });

  // === PHONE === //
  const phoneProviderData = _.find(user.providerData, (data) => {
    return data.providerId === "phone";
  });

  // === Error handler ===
  // We use this in case the linking went wrong, possibly handle the..
  // error, for example, to merge data

  async function errorHandler(error) {
    debugger;
    // we need to merge data with this error
    if (["auth/credential-already-in-use", "auth/email-already-in-use"].indexOf(error.code) > -1) {
      var prevUser = auth.currentUser;
      var prevUserDoc = await firestore.collection("users").doc(prevUser.uid).get();
      const prevUserData = prevUserDoc.data();
      // handle the merging data for missions
      var [previousCreateMissions, previousVolunteerMissions] = await Promise.all([
        firestore.collection("missions").where("ownerId", "==", prevUser.uid).get(),
        firestore.collection("missions").where("volunteerId", "==", prevUser.uid).get(),
      ]);

      var currentUserData;
      var currentUser;

      try {
        const result = await auth.signInWithCredential(error.credential);
        currentUser = result.user;
        const currentUserDoc = await firestore.collection("users").doc(currentUser.uid).get();
        currentUserData = currentUserDoc.data();

        // have to remove previous user, otherwise we can not link
        prevUser.delete();
        const linkResult = prevUser.linkWithCredential(error.credential);
        const signInResult = await auth.signInWithCredential(error.credential);
        // handle the merging data for users database
        const mergeData = _.mergeWith(prevUserData, currentUserData, (preVal, curVal) => {
          if (_.isArray(preVal)) {
            return preVal.concat(curVal);
          }
          return preVal ? preVal : curVal;
        });

        firestore.collection("users").doc(currentUser.uid).set(mergeData);

        // making sure missions data are consitency
        previousCreateMissions.forEach((doc) => {
          firestore.collection("missions").doc(doc.id).update({ ownerId: currentUser.uid });
        });
        previousVolunteerMissions.forEach((doc) => {
          firestore.collection("missions").doc(doc.id).update({ volunteerId: currentUser.uid });
        });
      } catch (e) {
        console.log(e);
        // rollback changes
        console.log("===error===");
        console.log(prevUser);
        console.log(prevUserData);
        console.log(currentUserData);
        console.log("===previous created mission===");
        previousCreateMissions.forEach((doc) => {
          firestore.collection("missions").doc(doc.id).update({ ownerId: prevUser.uid });
        });
        console.log("===previous volunteer mission===");
        previousVolunteerMissions.forEach((doc) => {
          firestore.collection("missions").doc(doc.id).update({ volunteerId: prevUser.uid });
        });
        console.log("===previous user===");
        firestore.collection("users").doc(prevUser.uid).set(prevUserData);
        console.log("===current user===");
        firestore.collection("users").doc(currentUser.uid).set(currentUserData);
      } finally {
        return;
      }
    }
    throw error;
  }
  /*===END Linking Control===*/

  const isLoading = !firebaseProfile.isLoaded || !user.isLoaded;
  // not used yet
  //<UserStatus status={status} setStatus={setStatus} />
  return (
    <Page template="white" title="Profile" spacing={3} isLoading={isLoading}>
      <Card>
        <UserOverview profile={profile} view={view} setProfile={setProfile} />
      </Card>
      <Grid item className={classes.fullWidth}>
        <ProfileControlButtons
          isEdit={isEdit}
          saveAction={saveProfileAction}
          cancelAction={cancelProfileAction}
          editAction={editProfileAction}
        />
      </Grid>
      <Card>
        <Grid container className={classes.linkedAccountContainer} spacing={3} direction="column">
          <LinkPhoneAccount
            firebase={firebase}
            data={phoneProviderData}
            auth={auth}
            errorHandler={errorHandler}
            captchaVerifier={captchaVerifier}
          />
          <LinkGoogleAccount
            data={googleProviderData}
            provider={googleProvider}
            auth={auth}
            errorHandler={errorHandler}
          />
        </Grid>
      </Card>
    </Page>
  );
};

UserProfile.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(UserProfile);

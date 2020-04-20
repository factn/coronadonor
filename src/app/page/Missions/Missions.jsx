import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

import { MissionList } from "../../component";
import UserPhoneUnverifiedPopup from "../../component/UserPhoneUnverifiedPopup";
import { Page } from "../../layout";
import { Mission, User } from "../../model";

/**
 * Component for listing missions
 *
 * @param {object} props.auth - Object obtained from firebase.auth state
 * @param {object} props.history - Object obtained from React Router
 */
const MissionsPage = ({ auth, history, missions }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  async function userVolunteeringHandler(missionId) {
    // We need a little more information from user at this point
    if (!auth.phoneNumber) {
      setPopupOpen(true);
      return;
    }
    User.volunteerMission(auth.uid, missionId);
  }

  if (!missions) return null;

  return (
    <Page title="Missions Available">
      <MissionList
        missions={missions}
        history={history}
        isEmpty={isEmpty(missions)}
        isLoaded={isLoaded(missions)}
        isEmptyText="There are no missions available"
        callToAction={{
          text: "Accept Mission",
          onClick: (missionId) => userVolunteeringHandler(missionId),
        }}
        handleUserVolunteering={userVolunteeringHandler}
      />
      <UserPhoneUnverifiedPopup open={popupOpen} handleClose={() => setPopupOpen(false)} />
    </Page>
  );
};

MissionsPage.propTypes = {
  /**
   * User info
   */
  auth: PropTypes.shape({
    uid: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  /**
   * Navigation history provided by React Router
   */
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  let missions = state.firestore.ordered.missionsUnassigned;
  missions = Mission.loads(missions);
  return {
    missions: missions,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect((props) => {
    return [
      {
        collection: "missions",
        where: [["status", "==", "unassigned"]],
        storeAs: "missionsUnassigned",
      },
    ];
  })
)(withRouter(MissionsPage));

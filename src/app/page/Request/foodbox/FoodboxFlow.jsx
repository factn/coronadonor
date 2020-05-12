import { Paper, Tab, Tabs } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useReducer } from "react";

import { H4 } from "../../../component";
import ConfirmStep from "./ConfirmStep";
import DeliveryStep from "./DeliveryStep";
import FoodboxStep from "./FoodboxStep";
import { ErrorSnackbar } from "../../../component/Snackbars";
import { reducer, initialState } from "./reducer";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
  },
  content: {
    margin: "0rem 1rem",
  },
  tabMargin: {
    margin: "1rem 0",
  },
}));

const stepComponents = [FoodboxStep, DeliveryStep, ConfirmStep];
const tabNames = ["FOODBOX", "DELIVERY", "CONFIRM"];

export default function FoodboxFlow() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const ActiveComponent = stepComponents[state.step];

  return (
    <div className={classes.root}>
      <Paper className={classes.tabMargin} elevation={3} square>
        <Tabs value={state.step} indicatorColor="primary" textColor="primary" centered>
          {tabNames.map((tab, idx) => (
            <CustomTab icon={<H4>{idx + 1}</H4>} key={tab} label={tab} disableRipple />
          ))}
        </Tabs>
      </Paper>
      <div className={classes.content}>
        <ActiveComponent state={state} dispatch={dispatch} />
      </div>
      <ErrorSnackbar
        open={state.error !== null}
        handleClose={() => dispatch({ type: "ERROR", payload: null })}
        errorMessage={state.error}
        autoHideDuration={null}
      />
    </div>
  );
}

const CustomTab = withStyles((theme) => ({
  root: {
    color: theme.color.vibrantPurple,
  },
}))(Tab);

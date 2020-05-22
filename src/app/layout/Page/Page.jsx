import { Grid } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";

import { withLoading } from "../../HOC";
import Appbar from "../Appbar";
import { H1 } from "../../component";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    flexDirection: "column",
    flexWrap: "nowrap",
    minHeight: "100%",
    padding: 0,
  },
  title: {
    padding: theme.spacing(2),
  },
}));

/**
 * Represents a Customised Page.
 * @param {string} appbar - The Title of the app bar.
 * @param {object} children - The content of the page.
 * @param {string} title - The Title of the page.
 * @param {number} maxWidth - The maximum width of the page.
 * @param {object} rest - Rest of the properties passed to the page..
 */
const Page = ({ appbar, children, maxWidth, title, titleAlign = "left" }) => {
  const classes = useStyles();
  return (
    <Container maxWidth={maxWidth ? maxWidth : "sm"} className={classes.root}>
      <Grid container className={classes.root}>
        <Grid item>
          <Appbar>{appbar}</Appbar>
        </Grid>
        <Grid container item role="main" direction="column">
          {title && (
            <H1 align={titleAlign} className={classes.title}>
              {title}
            </H1>
          )}
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

Page.propTypes = {
  appbar: PropTypes.element,
  maxWidth: PropTypes.string,
  title: PropTypes.string,
  titleAlign: PropTypes.string,
  children: PropTypes.node,
};

export default withLoading(Page);

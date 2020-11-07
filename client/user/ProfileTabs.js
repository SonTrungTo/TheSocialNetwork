import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FollowGrid from "./FollowGrid";
import FindPeople from "./FindPeople";
import PostList from "../post/PostList";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            { value === index && (
                <Box p={3}>
                    <Typography>
                        {children}
                    </Typography>
                </Box>
            ) }
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.any.isRequired,
    index: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%'
    }
}));

export default function ProfileTabs(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <div className={ classes.root }>
            <AppBar position="static" color="default">
                <Tabs
                value={value}
                onChange={handleChange}
                TabIndicatorProps={{style: {background:'blue'}}}
                textColor="primary"
                variant="fullWidth"
                centered
                aria-label="centered tab">
                    <Tab label="Posts" {...a11yProps(0)} />
                    <Tab label="Following" {...a11yProps(1)} />
                    <Tab label="Followers" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
            axis={ theme.direction === 'rtl' ? 'x-reverse' : 'x' }
            index={value}
            onChangeIndex={handleChangeIndex}>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <FindPeople />
                    <PostList posts={ props.posts }
                    removeUpdate={ props.removeUpdate } />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <FollowGrid people={props.user.following || []} />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <FollowGrid people={props.user.followers || []} />
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}
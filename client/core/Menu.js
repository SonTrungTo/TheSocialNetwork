import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import auth from "../auth/auth-helper";
import { withRouter, Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    homeButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

const Menu = withRouter(({history}) => {
    const classes = useStyles();

    const isActive = (history, path) => {
        if (history.location.pathname === path) {
            return {color: '#ff4242'};
        } else {
            return {color: '#ffffff'};
        }
    };

    return (
        <div className={ classes.root }>
            <AppBar position="static">
                <Toolbar>
                    <Link to="/">
                        <IconButton edge="start" aria-label="Home" color="inherit"
                        className={ classes.homeButton }
                        style={ isActive(history, "/") }>
                            <HomeIcon />
                        </IconButton>
                    </Link>
                    <Typography variant="h6" className={ classes.title }>
                        SONBOOK
                    </Typography>
                    <Link to="/users">
                        <Button style={ isActive(history, "/users") }>
                            Users
                        </Button>
                    </Link>
                    { !auth.isAuthenticated() && (<span>
                    <Link to="/signin">
                        <Button style={ isActive(history, "/signin") }>
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button style={ isActive(history, "/signup") }>
                            Sign Up
                        </Button>
                    </Link>
                    </span>) }
                    { auth.isAuthenticated() && (<span>
                    <Link to={ "/user/" + auth.isAuthenticated().user._id }>
                        <Button style={ isActive(history, "/user/"
                        + auth.isAuthenticated().user._id) }>
                            Profile
                        </Button>
                    </Link>
                    <Button color="secondary"
                    onClick={() => auth.clearJWT(() => history.push('/'))}>
                        Sign Out
                    </Button>
                    </span>) }
                </Toolbar>
            </AppBar>
        </div>
    );
});

export default Menu;
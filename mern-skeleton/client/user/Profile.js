import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, Link } from "react-router-dom";
import auth from "../auth/auth-helper";
import { read } from "./api-user";

const useStyles = makeStyles(theme => ({
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.primary.main,
        textAlign: 'center'
    },
    root: {
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(98, 66, 255, 1)'
    }
}));

export default function Profile(props) {
    const classes = useStyles();
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const { token } = auth.isAuthenticated();

        read({
            userId: props.match.params.userId
        }, {t: token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
                setRedirectToSignin(true);
            } else {
                setUser(data);
            }
        });

        return function cleanUp() {
            abortController.abort();
        };
    }, []);

    if (redirectToSignin) {
        return (<Redirect to="/signin" />);
    }

    return (
        <Paper>
            
        </Paper>
    );
}
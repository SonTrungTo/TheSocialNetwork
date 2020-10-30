import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, Link } from "react-router-dom";
import auth from "../auth/auth-helper";
import { read } from "./api-user";
import DeleteUser from "./DeleteUser";

const useStyles = makeStyles(theme => ({
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.primary.main,
        textAlign: 'center',
        textTransform: 'capitalize'
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
    }, [props.match.params.userId]);

    if (redirectToSignin) {
        return (<Redirect to="/signin" />);
    }

    return (
        <Paper elevation={4} className={ classes.root }>
            <Typography variant="h6" component="p" className={ classes.title }>
                Profile
            </Typography>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ user.name }
                    secondary={ user.email } />
                    { auth.isAuthenticated().user &&
                    auth.isAuthenticated().user._id === user._id && (
                    <ListItemSecondaryAction>
                        <Link to={"/user/edit/" + user._id}>
                            <IconButton color="primary" aria-label="Edit">
                                <Edit />
                            </IconButton>
                        </Link>
                        <DeleteUser userId={ user._id } />
                    </ListItemSecondaryAction>
                    ) }
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary={
                        "Joined: " + new Date(user.created).toDateString()
                    } />
                </ListItem>
            </List>
        </Paper>
    );
}
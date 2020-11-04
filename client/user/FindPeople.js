import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { findPeople, follow } from "./api-user";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import Error from "@material-ui/icons/Error";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import auth from "../auth/auth-helper";

const useStyles = makeStyles(theme => ({
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 10
    },
    error: {
        marginRight: theme.spacing(2)
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FindPeople() {
    const classes = useStyles();
    const [values, setValues] = useState({
        users: [],
        error: '',
        open: false
    });
    const jwt = auth.isAuthenticated();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        findPeople({
            userId: jwt.user._id
        }, {t: jwt.token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({...values, error: data.error});
            } else {
                setValues({...values, error: '',
            users: data});
            }
        });

        return function cleanUp() {
            abortController.abort();
        }
    }, []);

    const clickFollow = (user, index) => {
        follow({
            userId: jwt.user._id
        }, {t: jwt.token}, user._id).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({...values, error: data.error});
            } else {
                let toBeFollowing = values.users;
                toBeFollowing.splice(index, 1);
                setValues({...values, users: toBeFollowing,
                open: true, followMessage: `Following ${user.name}`,
                error: ''});
            }
        });
    };

    const handleClose = () => {
        setValues({...values, open: false});
    };

    return (
        <div>
            <Typography color="primary" component="h6">
                Who To Follow
            </Typography>
            <List>
                { values.users.map((user, i) => {
                    return (
                        <span key={i}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={ classes.bigAvatar }
                                    src={ "/api/users/photo/" + user._id } />
                                </ListItemAvatar>
                                <ListItemText primary={ user.name } />
                                <ListItemSecondaryAction className={ classes.follow }>
                                    <Link to={ "/user/" + user._id }>
                                        <IconButton variant="contained"
                                        color="secondary"
                                        className={ classes.viewButton }>
                                            <Visibility />
                                        </IconButton>
                                    </Link>
                                    <Button aria-label="Follow"
                                    color="primary" variant="contained"
                                    onClick={ () => {clickFollow(user, i)} }>
                                        Follow
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </span>
                    );
                }) 
                }
                { values.error && (
                <ListItem>
                    <ListItemText primary={
                        <Typography color="error" component="p">
                            <Icon color="error" className={ classes.error }>
                                <Error />
                            </Icon>
                            { values.error }
                        </Typography>
                    } />
                </ListItem>
                ) }
            </List>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }} open={values.open}
            autoHideDuration={ 5000 }
            onClose={handleClose}>
                <Alert severity="success" onClose={handleClose}>
                    { values.followMessage }
                </Alert>
            </Snackbar>
        </div>
    );
}
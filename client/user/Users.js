import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { list } from "./api-user";
import auth from "../auth/auth-helper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        background: 'linear-gradient(45deg, #e194ff 30%, #f305ff 50%)'
    }
}));

export default function Users() {
    const [users, setUsers] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const { token } = auth.isAuthenticated();

        list({t: token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        });

        return function cleanUp() {
            abortController.abort();
        }
    }, []);

    return (
        <Paper elevation={4} className={ classes.root }>
            <Typography variant="h6" className={ classes.title }>
                All Users
            </Typography>
            <List dense>
                { users.map((user, i) => 
                <Link to={ "/user/" + user._id } key={ i }>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Person />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={ user.name } />
                        <ListItemSecondaryAction>
                            <IconButton>
                                <ArrowForward />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Link>
                ) }
            </List>
        </Paper>
    );
}
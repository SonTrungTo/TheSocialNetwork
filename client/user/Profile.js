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
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, Link } from "react-router-dom";
import auth from "../auth/auth-helper";
import { read } from "./api-user";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/api-post";

const useStyles = makeStyles(theme => ({
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.primary.main,
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    error: {
        marginRight: theme.spacing(2)
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 10
    }
}));

export default function Profile(props) {
    const classes = useStyles();
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [values, setValues] = useState({
        profileUser: {},
        following: false,
        error: ''
    });
    const [posts, setPosts] = useState([]);
    const photoUrl = values.profileUser._id ?
        `/api/users/photo/${values.profileUser._id}?${new Date().getTime()}` :
        '/api/users/defaultphoto';
    const jwt = auth.isAuthenticated();
    const clickFollowButton = (callApi) => {
        callApi({
            userId: jwt.user._id
        }, {t: jwt.token}, values.profileUser._id).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, following: !values.following,
                profileUser: data, error: ''});
            }
        });
    };
    const loadPosts = (user) => {
        listByUser({
            userId: user
        }, {t: jwt.token}).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({...values, error: data.error});
            } else {
                setValues({...values, error: ''});
                setPosts(data);
            }
        });
    };
    const removePost = (post) => {
        let updatedPosts = [...posts];
        let index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const checkFollowing = (profileUser) => {
            const match = profileUser.followers.some(follower => {
                return follower._id === jwt.user._id;
            });
            return match;
        };

        read({
            userId: props.match.params.userId
        }, {t: jwt.token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
                setRedirectToSignin(true);
            } else {
                const following = checkFollowing(data);
                setValues({...values, profileUser: data, following: following});
                loadPosts(data._id);
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
                        <Avatar src={ photoUrl } className={ classes.bigAvatar } />
                    </ListItemAvatar>
                    <ListItemText primary={ values.profileUser.name }
                    secondary={ values.profileUser.email } />
                    <ListItemSecondaryAction>
                    { jwt.user &&
                    jwt.user._id === values.profileUser._id ?
                    (<div>
                        <Link to={"/user/edit/" + values.profileUser._id}>
                            <IconButton color="primary" aria-label="Edit">
                                <Edit />
                            </IconButton>
                        </Link>
                        <DeleteUser userId={ values.profileUser._id } />
                    </div>) :
                    <FollowProfileButton following={ values.following }
                    onButtonClick={ clickFollowButton } />
                    }
                    </ListItemSecondaryAction>
                </ListItem>
                { values.error && (
                <ListItem>
                    <Typography color="error" component="p">
                        <Icon color="error" className={ classes.error }>
                            <Error />
                        </Icon>
                        { values.error }
                    </Typography>
                </ListItem>
                ) }
                <ListItem>
                    <ListItemText primary={ values.profileUser.about } />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary={
                        "Joined: " + new Date(values.profileUser.created).toDateString()
                    } />
                </ListItem>
                <ListItem>
                    <ProfileTabs user={ values.profileUser } posts={ posts }
                    removeUpdate={ removePost } />
                </ListItem>
            </List>
        </Paper>
    );
}
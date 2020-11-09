import React, { useState, useEffect } from "react";
import { listNewsFeed } from "./api-post";
import auth from "../auth/auth-helper";
import NewPost from "./NewPost";
import PostList from "./PostList";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    error: {
        marginRight: theme.spacing(2)
    }
}));

export default function Newsfeed() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [errorState, setErrorState] = useState({
        error: ''
    });

    const addPost = (post) => {
        let updatedPosts = [...posts];
        updatedPosts.unshift(post);
        setPosts(updatedPosts);
    };

    const removePost = (post) => {
        let updatedPosts = [...posts];
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated();

        listNewsFeed({
            userId: jwt.user._id
        }, {t: jwt.token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
                setErrorState({...errorState, error: data.error});
            } else {
                setErrorState({...errorState, error: ''});
                setPosts(data);
            }
        });

        return function cleanUp() {
            abortController.abort();
        }

    }, []);

    return (
        <div>
            <Card>
                <Typography type="title">Newsfeed</Typography>
                <Divider />
                <NewPost addUpdate={ addPost } />
                <Divider />
                <PostList removeUpdate={ removePost } posts={ posts } />
                { errorState.error && (
                    <Typography color="error">
                        <Icon color="error" className={ classes.error }>
                            <Error />
                        </Icon>
                        { errorState.error }
                    </Typography>
                ) }
            </Card>
        </div>
    );
}
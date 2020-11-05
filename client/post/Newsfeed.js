import React, { useState } from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";

export default function Newsfeed(props) {
    const [posts, setPosts] = useState([]);

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

    return (
        <div>
            <Card>
                <Typography type="title">Newsfeed</Typography>
                <Divider />
                <NewPost addUpdate={ addPost } />
                <Divider />
                <PostList removeUpdate={ removePost } posts={ posts } />
            </Card>
        </div>
    );
}
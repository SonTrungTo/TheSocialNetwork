import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Post from "./Post";

const useStyles = makeStyles(theme => ({
    postList: {
        marginTop: 24
    }
}));

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
};

export default function PostList(props) {
    const classes = useStyles();

    return (
        <div className={ classes.postList }>
            { props.posts.map((item, i) => {
                <Post post={ item } key={ i }
                onRemove={ props.removeUpdate } />
            }) 
            }
        </div>
    );
}
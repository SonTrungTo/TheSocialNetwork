import React, { useState, useEffect } from "react";
import { comment } from "./api-post";
import auth from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
    smallAvatar: {

    },
    cardHeader: {

    }
}));

Comments.propTypes = {
    postId: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
    updateComments: PropTypes.func.isRequired
};

export default function Comments(props) {
    const classes = useStyles();
    const jwt = auth.isAuthenticated();
    const [text ,setText] = useState('');
    const addComment = (event) => {
        if (event.keyCode === 13 && event.target.value) {
            event.preventDefault();
            comment({
                userId: jwt.user._id
            }, {t: jwt.token}, props.postId, { text: text }).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setText('');
                    props.updateComments(data.comments);
                }
            });
        }
    }

    return (
        <div>
            <Card>
                <CardHeader avatar={
                    <Avatar src={ "/api/users/photo/" + jwt.user._id }
                    className={ classes.smallAvatar } />
                }
                title={
                    <TextField multiline
                    onKeyDown={ addComment }
                    value={ text }
                    placeholder="Write something..." />
                }
                className={ classes.cardHeader } />
            </Card>
        </div>
    );
};
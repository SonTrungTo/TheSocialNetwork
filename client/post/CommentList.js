import React, { useState } from "react";
import { comment, uncomment } from "./api-post";
import auth from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import Comment from "./Comment";

const useStyles = makeStyles(theme => ({
    smallAvatar: {
        width: 25,
        height: 25
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    commentField: {
        width: '96%'
    }
}));

Comments.propTypes = {
    postId: PropTypes.string.isRequired,
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
    };

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const deleteComment = comment => event => {
        uncomment({
            t: jwt.token
        }, props.postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                props.updateComments(data.comments);
            }
        });
    };

    return (
        <div>
            <CardHeader avatar={
                <Avatar src={ "/api/users/photo/" + jwt.user._id }
                className={ classes.smallAvatar } />
            }
            title={
                <TextField multiline
                onKeyDown={ addComment }
                value={ text }
                onChange={ handleChange }
                placeholder="Write something..."
                className={ classes.commentField }
                margin="normal" />
            }
            className={ classes.cardHeader } />
            { props.comments.map((comment, i) => {
                return (
                    <Comment comment={ comment }
                    deleteComment={ deleteComment }
                    postId={ props.postId }
                    key={ i } />
                );
            }) }
        </div>
    );
};
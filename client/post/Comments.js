import React, { useState } from "react";
import { Link } from "react-router-dom";
import { comment } from "./api-post";
import auth from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import PropTypes from "prop-types";

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
    },
    commentText: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        margin: `2px ${theme.spacing(1)}px 2px 2px`
    },
    deleteComment: {
        fontSize: '1.6em',
        verticalAlign: 'middle',
        cursor: 'pointer',
        marginLeft: theme.spacing(2)
    },
    dateDisplay: {
        display: 'block',
        fontSize: '0.8em',
        color: 'gray'
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

    const deleteComment = () => {

    };

    const commentBody = comment => {
        return (
            <p className={ classes.commentText }>
                <Link to={ "/user/" + comment.postedBy._id }>
                    { comment.postedBy.name }
                </Link>
                <br />
                { comment.text }
                <span className={ classes.dateDisplay }>
                    { new Date(comment.created).toDateString() }
                    { jwt.user._id === comment.postedBy._id &&
                    <IconButton color="secondary" className={ classes.deleteComment }
                    onClick={ deleteComment }>
                        <Delete />    
                    </IconButton> }
                </span>
            </p>
        );
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
                    <CardHeader avatar={
                        <Avatar src={ "/api/users/photo" + comment.postedBy._id }
                         />
                    }
                    title={ commentBody(comment) }
                    className={ classes.cardHeader }
                    key={ i } />
                );
            }) }
        </div>
    );
};
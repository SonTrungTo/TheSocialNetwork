import React, { useState } from "react";
import { Link } from "react-router-dom";
import { commentLike, commentUnlike } from "./api-post";
import auth from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PropTypes from "prop-types";

Comment.propTypes = {
    deleteComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
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
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        flexGrow: 1
    },
    button: {
        margin: theme.spacing(1)
    },
    root: {
        display: 'flex'
    },
    like: {
        alignSelf: 'center'
    }
}));

export default function Comment(props) {
    const classes = useStyles();
    const jwt = auth.isAuthenticated();
    const checkLike = (likes) => {
        let match = likes.indexOf(jwt.user._id) !== -1;
        return match;
    };
    const [values, setValues] = useState({
        like: checkLike(props.comment.likes),
        likes: props.comment.likes.length
    });
    const clickLike = () => {
        const apiCall = values.like ? commentUnlike : commentLike;
        apiCall({
            userId: jwt.user._id
        }, { t: jwt.token }, props.postId, props.comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({...values,
                    like: !values.like,
                    likes: data.comments
                    .filter(comment => comment._id === props.comment._id)[0]
                    .likes.length
                });
            }
        });
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
                    onClick={ props.deleteComment(comment) }>
                        <Delete />
                    </IconButton>
                    }
                </span>
            </p>
        );
    };

    return (
        <div className={ classes.root }>
            <span className={ classes.like }>
                { values.like ?
                <IconButton color="secondary" aria-label="CommentLike"
                onClick={ clickLike } className={ classes.button }>
                    <FavoriteIcon />
                </IconButton> :
                <IconButton color="secondary" aria-label="CommentUnlike"
                onClick={ clickLike } className={ classes.button }>
                    <FavoriteBorderIcon />
                </IconButton> } <span> {values.likes} </span>
            </span>
            <CardHeader avatar={
                <Avatar src={ "/api/users/photo/" + props.comment.postedBy._id } />
            }
            title={ commentBody(props.comment) }
            className={ classes.cardHeader } />
        </div>
    );
};
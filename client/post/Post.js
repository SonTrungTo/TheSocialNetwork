import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import auth from "../auth/auth-helper";
import { remove, like, unlike } from "./api-post";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Comments from "./Comments";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    text: {
        margin: theme.spacing(2)
    },
    photo: {
        textAlign: 'center',
        backgroundColor: "#f2f5f4",
        padding: theme.spacing(2)
    },
    media: {
        height: 200
    },
    button: {
        margin: theme.spacing(2)
    }
}));

Post.propTypes = {
    post: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default function Post(props) {
    const classes = useStyles();
    const jwt = auth.isAuthenticated();
    const checkLike = (likes) => {
        let match = likes.indexOf(jwt.user._id) !== -1;
        return match;
    };
    const [values, setValues] = useState({
        like: checkLike(props.post.likes),
        likes: props.post.likes.length,
        comments: props.post.comments
    });

    const clickLike = () => {
        let callApi = values.like ? unlike : like;
        callApi({
            userId: jwt.user._id
        }, {t: jwt.token}, props.post._id).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({
                    ...values,
                    like: checkLike(data.likes),
                    likes: data.likes.length
                });
            }
        });
    };

    const deletePost = () => {
        remove({
            postId: props.post._id
        }, {t: jwt.token}).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                props.onRemove(data);
            }
        });
    };

    return (
        <div>
            <Card className={ classes.card }>
                <CardHeader avatar={
                    <Avatar src={"/api/users/photo/" + props.post.postedBy._id} />
                }
                action={ props.post.postedBy._id === jwt.user._id && (
                    <IconButton color="secondary"
                    onClick={ deletePost }>
                        <Delete />
                    </IconButton>
                ) }
                title={
                <Link to={"/user/" + props.post.postedBy._id }>
                    <Typography color="primary">
                        { props.post.postedBy.name }
                    </Typography>
                </Link> }
                subheader={ new Date(props.post.created).toDateString() }
                className={ classes.cardHeader } />
                <CardContent className={ classes.cardContent }>
                    <Typography component="p" className={ classes.text }>
                        { props.post.text }
                    </Typography>
                    { props.post.photo && (
                    <div className={ classes.photo }>
                        <img src={"/api/posts/photo/" + props.post._id}
                        className={ classes.media } />
                    </div>
                    ) }
                </CardContent>
                <CardActions>
                    { props.post.likes ? (
                        <IconButton aria-label="Like"
                        onClick={ clickLike } className={ classes.button }
                        color="secondary">
                            <FavoriteIcon />
                        </IconButton>
                    ) : (
                        <IconButton aria-label="Unlike"
                        onClick={ clickLike } className={ classes.button }
                        color="secondary">
                            <FavoriteBorderIcon />
                        </IconButton>
                    ) } <span>{ values.likes }</span>
                    <IconButton className={ classes.button }
                    color="primary" aria-label="Comment">
                        <CommentIcon />
                    </IconButton>
                    <span>{ values.comments.length }</span>
                </CardActions>
                <Divider />
                <Comments />
            </Card>
        </div>
    );
}
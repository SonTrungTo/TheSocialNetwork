import React, { useState, useEffect } from "react";
import { read } from "../user/api-user";
import { create } from "../post/api-post";
import auth from "../auth/auth-helper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({

}));

export default function NewPost(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        post: {},
        user: {}
    });
    const jwt = auth.isAuthenticated();

    const handleChange = name => event => {
        const value = name === "photo" ?
            event.target.files[0] : event.target.value;
        setValues({...values, post: {...values.post, [name]: value} });
    };

    const handleClick = () => {
        const form = new FormData();
        values.post.text && form.append('text', values.post.text);
        values.post.photo && form.append('photo', values.post.photo);

        create({
            userId: jwt.user._id
        }, {t: jwt.token}, form).then(data => {
            if (condition) {
                
            } else {
                
            }
        });
    };
}
import React, { useState, useEffect } from "react";
import { create } from "../post/api-post";
import auth from "../auth/auth-helper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#efefef',
        padding: `${theme.spacing(3)}px 0px 1px`
    },
    card: {
        backgroundColor: 'rgba(51, 136, 255, 0.09)',
        maxWidth: 600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        boxShadow: 'none'
    },
    cardHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    cardContent: {
        backgroundColor: 'white',
        paddingBottom: 0,
        paddingTop: 0
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '90%'
    },
    photoButton: {
        height: 30,
        marginBottom: 5
    },
    fileName: {
        verticalAlign: 'super'
    },
    error: {
        marginRight: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(2),
        display: "flex",
        flexDirection: 'reverse-row'
    },
    input: {
        display: 'none'
    }
}));

NewPost.propTypes = {
    addUpdate: PropTypes.func.isRequired
};

export default function NewPost(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        text: '',
        photo: '',
        user: {}
    });
    const jwt = auth.isAuthenticated();
    const photoURL = jwt.user._id ? `/api/users/photo/${jwt.user._id}` :
    `/api/users/defaultphoto`;

    useEffect(() => {
        setValues({...values, user: jwt.user});
    }, []);

    const handleChange = name => event => {
        const value = name === "photo" ?
            event.target.files[0] : event.target.value;
        setValues({...values, [name]: value });
    };

    const handleClick = () => {
        const form = new FormData();
        values.text && form.append('text', values.text);
        values.photo && form.append('photo', values.photo);

        create({
            userId: jwt.user._id
        }, {t: jwt.token}, form).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({...values, error: data.error});
            } else {
                setValues({...values, error: '', text: '', photo: ''});
                props.addUpdate(data);
            }
        });
    };

    return (
        <div className={ classes.root }>
            <Card className={ classes.card }>
                <CardHeader avatar={
                    <Avatar src={ photoURL } />
                }
                title={ values.user.name }
                className={ classes.cardHeader } />
                <CardContent className={ classes.cardContent }>
                    <TextField
                    multiline
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={ values.text }
                    onChange={ handleChange("text") }
                    margin="normal"
                    className={ classes.textField } />
                    <input accept="image/*" type="file"
                    className={ classes.input }
                    onChange={ handleChange("photo") }
                    id="photo-attach-button" />
                    <label htmlFor="photo-attach-button">
                        <IconButton color="secondary" className={ classes.photoButton }
                        component="span">
                            <AddAPhoto />
                        </IconButton>
                    </label>
                    <span className={ classes.fileName }>
                        { values.photo ? values.photo.name : "" }
                    </span>
                    { values.error && (
                    <Typography color="error" component="p">
                        <Icon color="error" className={ classes.error }>
                            <Error color="error" />
                        </Icon>
                        { values.error }
                    </Typography>
                    ) }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                    onClick={ handleClick } className={ classes.submit }
                    disabled={ values.text === '' }>
                        POST
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
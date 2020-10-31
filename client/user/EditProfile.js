import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import CloudUpload from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import auth from "../auth/auth-helper";
import { update, read } from "./api-user";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        textAlign: 'center'
    },
    textField: {
        textAlign: 'center'
    },
    submit: {
        margin: 'auto'
    },
    error: {
        marginRight: '10px'
    },
    cloudUpload: {
        marginLeft: theme.spacing(1),
        paddingBottom: theme.spacing(0.5)
    },
    images: {
        width: 200,
        height: 200
    },
    filename: {
        marginLeft: theme.spacing(2)
    }
}));

export default function EditProfile(props) {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const photoUrl = user._id ?
        `/api/users/photo/${user._id}?${new Date().getTime()}` :
        '/api/users/defaultphoto';

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const { token } = auth.isAuthenticated();

        read({
            userId: props.match.params.userId
        }, {t: token}, signal).then(data => {
            if (data.error) {
                console.log(data.error);
                setRedirectToSignin(true);
            } else {
                setUser(data);
            }
        });

        return function cleanUp() {
            abortController.abort();
        };
    }, [props.match.params.userId]);

    if (redirectToSignin) {
        return (<Redirect to="/signin" />);
    }

    const handleChange = name => event => {
        const value = name === 'photo' ? 
            event.target.files[0] : event.target.value;
        setUser({...user, [name]: value});
    };

    const clickSubmit = () => {
        const userData = new FormData();
        user.name && userData.append('name', user.name);
        user.email && userData.append('email', user.email);
        user.password && userData.append('password', user.password);
        user.retypePassword && userData.append('retypePassword', user.retypePassword);
        user.about && userData.append('about', user.about);
        user.photo && userData.append('photo', user.photo);

        update({
            userId: props.match.params.userId
        }, {t: auth.isAuthenticated().token}, userData).then(data => {
            if (data.error) {
                setUser({...user, error: data.error});
            } else {
                setUser({...user});
                setRedirectToProfile(true);
            }
        });
    };

    if (redirectToProfile) {
        return (<Redirect to={"/user/" + user._id} />);
    }

    return (
        <Card className={ classes.card }>
            <CardContent>
                <Typography variant="h6" className={ classes.title }>
                    Edit Profile
                </Typography>
                <div className={ classes.textField }>
                    <div>
                        <img className={ classes.images }
                        src={ photoUrl } />
                    </div>
                    <input type="file" accept="image/*"
                    onChange={ handleChange("photo") }
                    style={{display: 'none'}} id="icon-button-file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" color="default"
                        component="span">
                            Upload <CloudUpload className={ classes.cloudUpload } />
                        </Button>
                    </label>
                    <span className={ classes.filename }>
                        { user.photo ? user.photo.name : "" }
                    </span>
                    <br />
                    <TextField label="Name" id="name" margin="normal"
                    value={ user.name } onChange={ handleChange("name") } />
                    <br />
                    <TextField label="About" 
                    id="about"
                    margin="normal"
                    multiline rows="2"
                    value={ user.about } onChange={ handleChange("about") } />
                    <br />
                    <TextField label="Email" id="email" margin="normal"
                    value={ user.email } onChange={ handleChange("email") } />
                    <br />
                    <TextField label="Password" id="password" margin="normal"
                    type="password"
                    value={ user.password } onChange={ handleChange("password") } />
                    <br />
                    <TextField label="Confirm password" id="retypePassword" margin="normal"
                    type="password"
                    value={ user.retypePassword } onChange={ handleChange("retypePassword") } />
                    <br />
                </div>
                { user.error && (
                <Typography color="error" component="p">
                    <Icon color="error" className={ classes.error }>
                        <Error />
                    </Icon>
                    { user.error }
                </Typography>
                ) }
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained"
                onClick={ clickSubmit } className={ classes.submit }>
                    Submit
                </Button>
            </CardActions>
        </Card>
    );
}
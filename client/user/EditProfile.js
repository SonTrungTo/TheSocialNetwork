import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
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
    }
}));

export default function EditProfile(props) {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [redirectToProfile, setRedirectToProfile] = useState(false);

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
        setUser({...user, [name]: event.target.value});
    };

    const clickSubmit = () => {
        const updatedUser = {
            name: user.name || undefined,
            email: user.email || undefined,
            password: user.password || undefined,
            retypePassword: user.retypePassword || undefined
        };

        update({
            userId: props.match.params.userId
        }, {t: auth.isAuthenticated().token}, updatedUser).then(data => {
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
                    <TextField label="Name" id="name" margin="normal"
                    value={ user.name } onChange={ handleChange("name") } />
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
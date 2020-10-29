import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/core/styles";
import auth from "./auth-helper";
import { signin } from "./api-auth";
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
        color: theme.palette.primary.main,
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

export default function Signin(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        };

        signin(user).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                auth.authenticate(data, () => {
                    setValues({...values, error: '', redirectToReferrer: true});
                });
            }
        });
    };

    const { from } = props.location.state || {from: {pathname: '/'}};
    const {redirectToReferrer} = values;
    if (redirectToReferrer) {
        return <Redirect to={ from } />
    }

    return (
        <div>
            <Card className={ classes.card }>
                <CardContent>
                    <Typography variant="h6" className={ classes.title }>
                        Sign In
                    </Typography>
                    <div className={ classes.textField }>
                        <TextField label="Email" id="email" margin="normal"
                        value={ values.email }
                        onChange={ handleChange("email") } />
                        <br />
                        <TextField label="Password" id="password" margin="normal"
                        value={ values.password } type="password"
                        onChange={ handleChange("password") } />
                        <br />
                    </div>
                    { values.error && (
                    <Typography color="error" component="p">
                        <Icon color="error" className={ classes.error }>
                           <Error />
                        </Icon>
                        { values.error }
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
        </div>
    );
}
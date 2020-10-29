import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Error from "@material-ui/icons/Error";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "./api-user";

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

export default function Signup() {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: '',
        open: false,
        error: ''
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            retypePassword: values.retypePassword || undefined
        };

        create(user).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, open: true, error: ''});
            }
        });
    };

    return (
        <div>
            <Card className={ classes.card }>
                <CardContent>
                    <Typography variant="h6" className={ classes.title }>
                        Sign Up
                    </Typography>
                    <div className={ classes.textField }>
                        <TextField label="Name" id="name"
                        onChange={ handleChange("name") } margin="normal"
                        value={ values.name } />
                        <br />
                        <TextField label="Email" id="email"
                        margin="normal"
                        onChange={ handleChange("email") }
                        value={ values.email } />
                        <br />
                        <TextField label="Password" id="password"
                        type="password" margin="normal"
                        onChange={ handleChange("password") }
                        value={ values.password } />
                        <br />
                        <TextField label="Confirm password" id="retypePassword"
                        type="password" margin="normal"
                        onChange={ handleChange("retypePassword") }
                        value={ values.retypePassword } />
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
                    <Button color="primary" onClick={ clickSubmit }
                    className={ classes.submit } variant="contained">
                        Submit
                    </Button>
                </CardActions>
            </Card>
            <Dialog open={values.open} disableBackdropClick={true}>
                <DialogTitle>
                    New Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account successfully created!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" variant="contained">
                            Sign In
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>
    );
}
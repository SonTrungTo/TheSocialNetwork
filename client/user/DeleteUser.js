import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import auth from "../auth/auth-helper";
import { remove } from "./api-user";

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
};

export default function DeleteUser(props) {
    const [open, setOpen] = useState(false);
    const [openSecondary, setOpenSecondary] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [redirectToSignin, setRedirectToSignin] = useState(false);

    const clickSubmit = () => {
        const { token } = auth.isAuthenticated();

        remove({
            userId: props.userId
        }, {t: token}).then(data => {
            if (data.error) {
                console.log(data.error);
                setRedirectToSignin(true);
            } else {
                auth.clearJWT(() => console.log('deleted!'));
                setOpenSecondary(true);
            }
        });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseSecondary = () => {
        setOpenSecondary(false);
        setRedirectToHome(true);
    };

    if (redirectToHome) {
        return (<Redirect to="/" />);
    }

    if (redirectToSignin) {
        return (<Redirect to="/signin" />);
    }

    return (
        <span>
            <IconButton color="secondary" aria-label="Delete"
            onClick={ handleOpen }>
                <Delete />
            </IconButton>
            <Dialog open={ open } onClose={ handleClose }>
                <DialogTitle>
                    Delete Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure want to delete this account? 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained"
                    onClick={ handleClose }>
                        Cancel
                    </Button>
                    <Button color="secondary" variant="contained"
                    onClick={ clickSubmit }>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={ openSecondary } onClose={ handleClose } disableBackdropClick={ true }>
                <DialogTitle>
                    Deletion Confirmed!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your account has been deleted! 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained"
                    onClick={ handleCloseSecondary }>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    );
};
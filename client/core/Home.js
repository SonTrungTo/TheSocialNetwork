import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import madokaImg from "../assets/images/madoka.jpeg";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px \
        ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 450
    },
    menu: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Home = () => {
    const classes = useStyles();

    return (
        <div>
            <div className={ classes.menu }>
                <Link to="/signup">Sign up</Link>
                <Link to="/signin">Sign in</Link>
                <Link to="/users">Users</Link>
            </div>
            <Card className={ classes.card }>
                <Typography variant="h6" className={ classes.title }>
                    HOME PAGE
                </Typography>
                <CardMedia component="img" image={ madokaImg }
                className={ classes.media } title="Magical Girls" />
                <CardContent>
                    <Typography component="p" variant="body2">
                        Welcome to SonBook, a social media platform
                        for nerds.
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default Home;
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import madokaImg from "../assets/images/madoka.jpeg";
import Newsfeed from "../post/Newsfeed";
import FindPeople from "../user/FindPeople";
import auth from "../auth/auth-helper";

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
    root: {
        flexGrow: 1,
        margin: 30
    }
}));

const Home = ({history}) => {
    const classes = useStyles();
    const [defaultPage, setDefaultPage] = useState(false);

    useEffect(() => {
        setDefaultPage(auth.isAuthenticated());
        const unlisten = history.listen( () => {
            setDefaultPage(auth.isAuthenticated())
        });

        return () => {
            unlisten();
        }
    }, []);

    return (
        <div className={ classes.root }>
            { !defaultPage &&
            <Grid container spacing={ 8 }>
                <Grid item xs={ 12 }>
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
                </Grid>
            </Grid>
            }
            { defaultPage &&
            <Grid container spacing={ 8 }>
                <Grid item xs={ 12 } sm={ 7 }>
                    <Newsfeed />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <FindPeople />
                </Grid>
            </Grid>
            }
        </div>
    );
}

export default Home;
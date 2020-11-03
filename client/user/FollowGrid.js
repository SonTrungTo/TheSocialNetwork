import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

FollowGrid.propTypes = {
    people: PropTypes.array.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(2)
    },
    gridList: {
        width: 550,
        height: 220
    },
    gridListTile: {
        height: 120,
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    tileText: {
        color: theme.palette.primary.light,
        textAlign: 'center',
        marginTop: 10
    }
}));

export default function FollowGrid(props) {
    const classes = useStyles();

    return (
        <div className={ classes.root }>
            <GridList cellHeight={ 160 } className={ classes.gridList }
            cols={4}>
                { props.people.map((person, i) => {
                    return (
                <GridListTile key={i} className={ classes.gridListTile }>
                    <Link to={ "/user/" + person._id }>
                        <Avatar className={ classes.bigAvatar }
                        src={ "/api/users/photo/" + person._id } />
                        <Typography className={ classes.tileText }>
                            { person.name }
                        </Typography>
                    </Link>
                </GridListTile>        
                    );
                }) }
            </GridList>
        </div>
    );
}
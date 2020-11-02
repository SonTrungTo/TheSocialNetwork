import React from "react";
import { follow, unfollow } from "./api-user";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

FollowProfileButton.propTypes = {
    onButtonClick: PropTypes.func.isRequired,
    following: PropTypes.bool.isRequired
};

export default function FollowProfileButton(props) {
    const followClick = () => {
        props.onButtonClick(follow);
    };
    const  unfollowClick = () => {
        props.onButtonClick(unfollow);
    };

    return (
        <div>
            { props.following ?
            (<Button color="secondary" onClick={ unfollowClick }
            variant="contained">
                Unfollow
            </Button>) :
            (<Button color="primary" onClick={ followClick }
            variant="contained">
                Follow
            </Button>)
            }
        </div>
    );
};
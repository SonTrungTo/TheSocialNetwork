import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import Menu from "./core/Menu";

const MainRouter = () =>
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={ Home } />
            <PrivateRoute path="/users" component={ Users } />
            <Route path="/signup" component={ Signup } />
            <Route path="/signin" component={ Signin } />
            <PrivateRoute path="/user/edit/:userId" component={ EditProfile } />
            <PrivateRoute path="/user/:userId" component={ Profile } />
        </Switch>
    </div>

export default MainRouter;
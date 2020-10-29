import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";

const MainRouter = () =>
    <div>
        <Switch>
            <Route exact path="/" component={ Home } />
            <PrivateRoute path="/users" component={ Users } />
            <Route path="/signup" component={ Signup } />
            <Route path="/signin" component={ Signin } />
        </Switch>
    </div>

export default MainRouter;
import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./core/Home";

const MainRouter = () =>
    <div>
        <Switch>
            <Route exact path="/" component={ Home } />
        </Switch>
    </div>

export default MainRouter;
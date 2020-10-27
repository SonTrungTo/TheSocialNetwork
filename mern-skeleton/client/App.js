import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import { ThemeProvider } from "@material-ui/core/styles";
import MainRouter from "./MainRouter";
import theme from "./theme";

const App = () => 
    <BrowserRouter>
        <ThemeProvider theme={ theme }>
            <MainRouter />
        </ThemeProvider>
    </BrowserRouter>;

export default hot(module)(App);
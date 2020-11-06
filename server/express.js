// Back-end codes
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import Template from "../template";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

// Development bundling client codes
import path from "path";
import devBundle from "./devBundle"; // Comment out when in production

// Server-side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import MainRouter from "../client/MainRouter";
import { ThemeProvider, ServerStyleSheets } from "@material-ui/core/styles";
import theme from "../client/theme";

const app = express();
const CURRENT_WORKING_DIR = process.cwd();

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
devBundle.compile(app); // Comment out when in production

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", postRoutes);

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({
            error: err.name + ': ' + err.message
        });
    } else if (err) {
        return res.status(400).json({
            error: err.name + ': ' + err.message
        });
    }
});

app.get("*", (req, res) => {
    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={ req.url } context={ context }>
                <ThemeProvider theme={ theme }>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    );

    if (context.url) {
        return res.redirect(303, context.url);
    }
    const css = sheets.toString();
    res.status(200).send(Template({
        markup: markup,
        css: css
    }));
});

export default app;
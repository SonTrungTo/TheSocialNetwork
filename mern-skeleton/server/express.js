import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import Template from "../template";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use("/", userRoutes);
app.use("/", authRoutes);

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

app.get("/", (req, res) => {
    res.status(200).send(Template());
});

export default app;
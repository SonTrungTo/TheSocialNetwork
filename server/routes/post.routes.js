import postCtrl from "../controllers/post.controller";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import express from "express";

const router = express.Router();

router.route("/api/posts/feed/:userId")
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed);

router.route("/api/posts/by/:userId")
    .get(authCtrl.requireSignin, postCtrl.listByUser);

router.param('userId', userCtrl.userByID);

export default router;
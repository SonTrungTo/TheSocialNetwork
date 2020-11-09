import postCtrl from "../controllers/post.controller";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import express from "express";

const router = express.Router();

router.route("/api/posts/feed/:userId")
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed);

router.route("/api/posts/by/:userId")
    .get(authCtrl.requireSignin, postCtrl.listByUser);

router.route("/api/posts/new/:userId")
    .post(authCtrl.requireSignin, postCtrl.create);

router.route("/api/posts/photo/:postId").get(postCtrl.photo);

router.route("/api/posts/:postId")
    .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);

router.param('userId', userCtrl.userByID);
router.param('postId', postCtrl.postByID);

export default router;
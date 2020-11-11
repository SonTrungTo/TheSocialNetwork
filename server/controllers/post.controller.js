import Post from "../models/post.model";
import dbErrorHandler from "../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";

const listNewsFeed = async (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    try {
        let posts = await Post.find({postedBy: {
            $in: following
        }})
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec();
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const listByUser = async (req, res) => {
    try {
        let posts = await Post.find({postedBy: req.profile._id})
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec();
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const create = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Cannot create new post message"
            });
        }
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        try {
            await post.save();
            return res.status(200).json(post);
        } catch (err) {
            return res.status(400).json({
                error: dbErrorHandler.getErrorMessage(err)
            });
        }
    });
};

const photo = (req, res) => {
    res.set("Content-Type", req.post.photo.contentType);
    return res.status(200).send(req.post.photo.data);
};

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth &&
    String(req.post.postedBy._id) === String(req.auth._id);
    if (!isPoster) {
        return res.status(400).json({
            error: "Unauthorized request made by unauthorized user"
        });
    }
    next();
};

const remove = async (req, res) => {
    try {
        let post = req.post;
        let deletedPost = await post.remove();
        return res.status(200).json(deletedPost);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const like = async (req, res) => {
    try {
        let post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {likes: req.body.userId}
        }, {
            new: true
        });
        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const unlike = async (req, res) => {
    try {
        let post = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {likes: req.body.userId}
        }, {
            new: true
        });
        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const comment = async (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        let post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {comments: comment}
        }, {
            new: true
        })
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec();
        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const uncomment = async (req, res) => {
    let comment = req.body.comment;
    try {
        let post = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {comments: {_id: comment._id}}
        }, {
            new: true
        })
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec();
        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const postByID = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id)
        .populate('postedBy', '_id name')
        .exec();
        if (!post) {
            return res.status(400).json({
                error: "The post does not exist"
            });
        }
        req.post = post;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not fetch the post"
        });
    }
};

export default {
    listNewsFeed, listByUser, create, photo, postByID, isPoster,
    remove, like, unlike, comment, uncomment
};
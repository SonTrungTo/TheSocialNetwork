import Post from "../models/post.model";
import dbErrorHandler from "../helpers/dbErrorHandler";

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

export default {
    listNewsFeed, listByUser
};
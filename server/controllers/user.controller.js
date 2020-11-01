import User from "../models/user.model";
import dbErrorHandler from "../helpers/dbErrorHandler";
import extend from "lodash/extend";
import formidable from "formidable";
import fs from "fs";
import defaultPerson from "../../client/assets/images/defaultPhoto.png";

const list = async (req, res) => {
    try {
        const users = await User.find().select('name email created updated');
        return res.status(200).json(users);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const create = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            message: 'Successfully signed up!'
        });
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const read = (req, res) => {
    let user = req.profile;
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.status(200).json(user);
};

const update = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to upload photo"
            });
        }
        let user = req.profile;
        const photo = user.photo; // This is for updating without uploading a photo
        user = extend(user, {...fields, photo: photo});
        user.updated = Date.now();
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        try {
            await user.save();
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.status(200).json(user);
        } catch (err) {
            return res.status(400).json({
                error: dbErrorHandler.getErrorMessage(err)
            });
        }
    });
};

const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        return res.status(200).json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
};

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    next();
};

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+defaultPerson);
};

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec();
        if (!user) {
            return res.status(400).json({
                error: "User does not exist"
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not fetch the user"
        });
    }
};

export default {
    list, create, read, update, remove, userByID, photo, defaultPhoto
};
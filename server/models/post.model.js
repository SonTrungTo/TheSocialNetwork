import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: "Post message is required"
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    comments: [{
        text: {type: String, required: "Comment message is required"},
        created: {type: Date, default: Date.now},
        postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
        likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
    }]
});

export default mongoose.model('Post', PostSchema);
import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const comments = new Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

const publication = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 25,
        minlength: 3,
        required: true
    },
    description: {
        type: String,
        maxlength: 250
    },
    time : {
        type: Date,
        default: Date.now()
    },
    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [comments]
});

export default model('publications', publication);
import { Schema, model } from 'mongoose';

const user = new Schema({
    username : {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true,
    },
    password : {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true
    },
    email : {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    time : {
        type: Date,
        default: Date.now()
    },
    likes: [new Schema({
        id : {
            type: String,
            required: true
        }
    })],
    dislikes: [new Schema({
        id : {
            type: String,
            required: true
        }
    })],
    avatar: {
        type: String,
        default: ''
    }
});

export default model('users', user);
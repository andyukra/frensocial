import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const messages = new Schema({

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
    },
    image: {
        type: String,
        default: ''
    },
    thumb: {
        type: String,
        default: ''
    }

});

export default model('messages', messages);
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/frensocial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DATABASE OK'))
    .catch(err => console.log(err));
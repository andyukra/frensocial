import mongoose from 'mongoose';
const {connect, disconnect} = mongoose;

connect(`mongodb+srv://andyukra:salamaleiku@cluster0.dwsam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => {
        console.log('DATABASE OK');
        if(process.env['npm_lifecycle_event'] === 'build'){
            disconnect();
        }
    })
    .catch(err => console.log(err));

const x = 'asd';
export default x;
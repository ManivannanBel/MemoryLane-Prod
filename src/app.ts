import express, {Application} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import firebaseAdmin from 'firebase-admin';
import path from 'path';
//import cookieSession from 'cookie-session';

//Load models
require('./models/profiles');

//Passport config
require('./config/passport')(passport);

//Keys config
const keys = require('./config/keys');

const app : Application = express();

//soruce map support stack tracing
require('source-map-support').install();

//cross origin
app.use(cors());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : false}));
//parse application/json
app.use(bodyParser.json());

//Firebase Init
var serviceAccount = require("./config/firebasekey");      
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "gs://memory-lane-68e6c.appspot.com"
});

//DB connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify: false
})
.then(() => {
    console.log('db connected')
})
.catch(err => {
    console.log(err);
});

//cookieSession middleware
// app.use(cookieSession({
//     maxAge : 30 * 24 * 60 * 60 * 1000,
//     keys : [keys.cookieKey]
// }));
//passport middleware
app.use(passport.initialize());

//profiles route
app.use('/api/v0/profile/', require('./routes/profiles/v0/profiles'));
//moments route
app.use('/api/v0/M/', require('./routes/moments/v0/moments'));
//memories route
app.use('/api/v0/M/m/', require('./routes/memories/v0/memories'));
//auth route
app.use('/api/v0/auth/', require('./routes/auth/v0/auth'));
//memorylane route
app.use('/api/v0/', require('./routes/memoryLane/v0/memoryLane'));
//Relationship route
app.use('/api/v0/R/', require('./routes/relationships/v0/relationships'));
//Search route
app.use('/api/v0/', require('./routes/search/v0/search'));

// app.use(express.static('memory-lane-client/build'));

// app.get('*', (req, res) =>{
//     res.sendFile(path.resolve(__dirname, 'memory-lane-client', 'build', 'index.html'));
// });

//Server static assets in prod
if(process.env.NODE_ENV === 'production'){
    //Get static folder
    app.use(express.static('memory-lane-client/build'));

    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'memory-lane-client', 'build', 'index.html'));
    });
}
    

const PORT : Number = process.env.PORT as any || 5000;

app.listen(PORT, () => {
    console.log('Server runs at 5000');
});
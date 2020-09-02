"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
//import cookieSession from 'cookie-session';
//Load models
require('./models/profiles');
//Passport config
require('./config/passport')(passport_1.default);
//Keys config
const keys = require('./config/keys');
const app = express_1.default();
//soruce map support stack tracing
require('source-map-support').install();
//cross origin
app.use(cors_1.default());
//parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
//parse application/json
app.use(body_parser_1.default.json());
//Firebase Init
var serviceAccount = require("./config/firebasekey.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: "gs://memory-lane-68e6c.appspot.com"
});
//DB connection
mongoose_1.default.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
    console.log('db connected');
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
app.use(passport_1.default.initialize());
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
if (process.env.NODE_ENV === 'production') {
    //Get static folder
    app.use(express_1.default.static('memory-lane-client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, 'memory-lane-client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server runs at 5000');
});
//# sourceMappingURL=app.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AuthService = require('./authService');
const querystring_1 = __importDefault(require("querystring"));
const keys = require("../../../config/keys");
const router = express_1.default.Router();
const ProfileModel = mongoose_1.default.model("profiles");
//Google Oauth2.0
router.get("/google", passport_1.default.authenticate("google", { session: false, scope: ["profile", "email"] }));
//Google Oauth2.0 redirection
router.get("/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Successful authentication, redirect home.
    const profile = req.user;
    const payload = { isAuth: true, username: profile.username, id: profile._id };
    const token = yield AuthService.generateJWTToken(payload);
    //console.log(token);
    const query = querystring_1.default.stringify({ success: true, token });
    res.redirect('http://localhost:3000/?' + query);
}));
//facebook auth
router.get("/facebook", passport_1.default.authenticate("facebook", { session: false }));
//facebook auth redirection
router.get("/facebook/callback", passport_1.default.authenticate("facebook", { session: false, failureRedirect: "/" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Successful authentication
    const profile = req.user;
    const payload = { isAuth: true, username: profile.username, id: profile._id };
    const token = yield AuthService.generateJWTToken(payload);
    //console.log(token);
    const query = querystring_1.default.stringify({ success: true, token });
    res.redirect('http://localhost:3000/?' + query);
}));
//Register controller
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, confirmPassword, email } = req.body;
    console.log(req.body);
    const error = {};
    if (!email) {
        error.email = "email field is required";
    }
    if (!username) {
        error.username = "username field is required";
    }
    if (!password) {
        error.password = "password field is required";
    }
    if (!confirmPassword) {
        error.confirmPassword = "confirmation password field is required";
    }
    else if (password !== confirmPassword) {
        error.confirmPassword = "passwords doesn't match";
    }
    if (Object.keys(error).length !== 0) {
        res.status(400).send(error);
        return;
    }
    const profileObject = {
        username: username.toLowerCase(),
        firstname: username,
        email,
        password,
        profileImage: 'https://firebasestorage.googleapis.com/v0/b/memory-lane-68e6c.appspot.com/o/prodef.png?alt=media&token=8e86bcd7-1651-40db-8dc7-93328e995243'
    };
    ProfileModel.findOne({ email: email })
        .then(profile => {
        if (profile) {
            res.send('profile already exists');
        }
        else {
            bcryptjs_1.default.genSalt(10, (err, salt) => {
                bcryptjs_1.default.hash(password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        profileObject.password = hash;
                        new ProfileModel(profileObject)
                            .save()
                            .then(profile => {
                            res.send('profile created');
                        })
                            .catch(err => {
                            console.log(err);
                        });
                    }
                });
            });
        }
    })
        .catch(err => {
        console.log(err);
    });
}));
//Sign in  controller
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const errors = {};
    if (!email) {
        errors.email = "email must not be empty";
    }
    if (!password) {
        errors.password = "password must not be empty";
    }
    if (Object.keys(errors).length !== 0) {
        res.status(400).send(errors);
        return;
    }
    ProfileModel.findOne({ email }).then((profile) => __awaiter(void 0, void 0, void 0, function* () {
        if (!profile) {
            res.status(404).json({ error: "Email or password incorrect" });
        }
        else {
            if (!profile.password) {
                res.status(404).json({ error: "Email or password incorrect" });
            }
            else {
                bcryptjs_1.default.compare(password, profile.password).then((isMatch) => __awaiter(void 0, void 0, void 0, function* () {
                    if (isMatch) {
                        const payload = { isAuth: true, username: profile.username, id: profile._id };
                        const token = yield AuthService.generateJWTToken(payload);
                        //console.log(token);
                        res.status(200).send({ success: true, token });
                    }
                    else {
                        res.status(404).json({ error: "Email or password incorrect" });
                    }
                }));
            }
        }
    }));
}));
//Sign out  controller
// router.get("/signout", async (req: Request, res: Response) => {
//   //console.log("signout");
//   req.logout();
//   res.redirect('http://localhost:3000/');
// });
//Email verification controller
router.post("/verify/email/:verificationCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("verify email");
}));
// router.get('/current_user', (req : Request, res : Response) => {
//   const user : any = req.user;
//   const authRes = ((user && user.username) ? {isAuth : true, username : user.username} : {isAuth : false, username : undefined});
//   res.send(authRes);
// });
module.exports = router;
//# sourceMappingURL=auth.js.map
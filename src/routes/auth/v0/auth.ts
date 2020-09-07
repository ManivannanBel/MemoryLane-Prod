import express, { Request, Response, Router } from "express";
import mongoose, { Document, Model } from "mongoose";
import passport from "passport";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { IProfile } from "../../../types/modelTypes";
const AuthService = require('./authService');
import querystring from 'querystring'; 

const keys = require("../../../config/keys");

const router: Router = express.Router();

const ProfileModel: Model<IProfile> = mongoose.model("profiles");

//Google Oauth2.0
router.get(
  "/google",
  passport.authenticate("google", {session : false, scope: ["profile", "email"] })
);

//Google Oauth2.0 redirection
router.get(
  "/google/callback",
  passport.authenticate("google", {session : false, failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    const profile : any = req.user;
    const payload = { isAuth: true, username: profile.username, id : profile._id };
    const token = await AuthService.generateJWTToken(payload);
    //console.log(token);
    const query = querystring.stringify({success : true, token})
    if(process.env.NODE_ENV === 'production'){
      res.redirect('https://memorylane-api.herokuapp.com/?'+query);
    }else{
      res.redirect('http://localhost:3000/?'+query);
    }
  }
);

//facebook auth
router.get("/facebook", passport.authenticate("facebook", {session : false}));

//facebook auth redirection
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session : false, failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    //Successful authentication
    const profile : any = req.user;
    const payload = { isAuth: true, username: profile.username, id : profile._id};
    const token = await AuthService.generateJWTToken(payload);
    //console.log(token);
    const query = querystring.stringify({success : true, token})
    if(process.env.NODE_ENV === 'production'){
      res.redirect('https://memorylane-api.herokuapp.com/?'+query);
    }else{
      res.redirect('http://localhost:3000/?'+query);
    }
  }
);

//Register controller
router.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    password,
    confirmPassword,
    email
  }: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
  } = req.body;

  console.log(req.body);
  

  const error : { [k : string] : string } = {};

  if(!email){
    error.email = "email field is required";
  }
  if(!username){
    error.username = "username field is required";
  }
  if(!password){
    error.password = "password field is required";
  }
  if(!confirmPassword){
    error.confirmPassword = "confirmation password field is required";
  }else if(password !== confirmPassword){
    error.confirmPassword = "passwords doesn't match";
  }

  if(Object.keys(error).length !== 0){
    res.status(400).send(error);
    return;
  }

  const profileObject = {
    username : username.toLowerCase(),
    firstname : username,
    email,
    password,
    profileImage : ''
  }

  try{
    ProfileModel.findOne({email : email})
    .then(profile => {
      if(profile){
        return res.status(409).send({error : 'email already exists'});
      }else{
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if(err){
              throw err;
            }else{
              profileObject.password = hash;
              new ProfileModel(profileObject)
                    .save()
                    .then(profile => {
                      return res.status(201).send('profile created');
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
  }catch(err){
    res.status(502).send({error : 'username may be already exist'});
  }
});

//Sign in  controller
router.post("/signin", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const errors: { [k: string] : string } = {};
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

  try{
    ProfileModel.findOne({ email }).then( async (profile: IProfile) => {
      if (!profile) {
        res.status(401).json({ error: "Email or password incorrect" });
      } else {
        if(!profile.password){
          res.status(401).json({ error: "Email or password incorrect" });
        }else{
          bcrypt.compare(password, profile.password).then( async (isMatch) => {
            if (isMatch) {
              const payload = { isAuth: true, username: profile.username, id : profile._id };
              const token = await AuthService.generateJWTToken(payload);
              //console.log(token);
              res.status(200).send({success : true, token});
            } else {
              res.status(401).json({ error: "Email or password incorrect" });
            }
          }); 
        }
      }
    });
  }catch(err){
    res.status(502).send('user login unsuccessfull');
  }
});

//Sign out  controller
// router.get("/signout", async (req: Request, res: Response) => {
//   //console.log("signout");
//   req.logout();
//   res.redirect('http://localhost:3000/');
// });

//Email verification controller
router.post(
  "/verify/email/:verificationCode",
  async (req: Request, res: Response) => {
    res.send("verify email");
  }
);

// router.get('/current_user', (req : Request, res : Response) => {
//   const user : any = req.user;
//   const authRes = ((user && user.username) ? {isAuth : true, username : user.username} : {isAuth : false, username : undefined});
//   res.send(authRes);
// });

module.exports = router;

import {Request, Response, NextFunction} from 'express';
module.exports = (req : Request, res : Response, next : NextFunction) => {
    console.log("check authorized");
    if(!req.user){
        console.log("not authorized");
        
        return res.status(401).send({error : 'You are not logged in'});
    }
    next();
}
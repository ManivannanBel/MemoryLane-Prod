import jwt from 'jsonwebtoken';
const keys = require('../../../config/keys');

const generateJWTToken = async (payload : any) => {
    //sign token
    // jwt.sign(
    //     payload,
    //     keys.secretOrKey,
    //     { expiresIn: 3600 },
    //     (err, token) => {
    //       res.json({
    //         success: true,
    //         token: `Bearer ${token}`
    //       });
    //     }
    //   );
    const token = jwt.sign(payload, keys.secretOrKey, {expiresIn: "1 days"});
    return `Bearer ${token}`;  
}

module.exports = {generateJWTToken};
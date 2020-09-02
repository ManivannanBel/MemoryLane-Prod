"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (req, res, next) => {
    console.log("check authorized");
    if (!req.user) {
        console.log("not authorized");
        return res.status(401).send({ error: 'You are not logged in' });
    }
    next();
};
//# sourceMappingURL=requireLogin.js.map
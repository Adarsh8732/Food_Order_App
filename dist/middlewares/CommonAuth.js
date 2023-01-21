"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
const utility_1 = require("../utility");
const Authenticate = (req, res, next) => {
    const validate = (0, utility_1.ValidateSignature)(req);
    if (validate) {
        // console.log("validated")
        next();
    }
    else {
        return res.json({ 'message': "user not authoreized" });
    }
};
exports.Authenticate = Authenticate;
//# sourceMappingURL=CommonAuth.js.map
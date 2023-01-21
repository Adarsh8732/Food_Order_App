"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const Router = express_1.default.Router();
exports.UserRouter = Router;
Router.post('/signup', controllers_1.UserSignUp);
Router.post('/login', controllers_1.UserLogin);
Router.use(middlewares_1.Authenticate);
Router.patch('/verify', controllers_1.UserVerify);
Router.get('/otp', controllers_1.RequestOtp);
Router.get('/profile', controllers_1.GetUserProfile);
Router.patch('/profile', controllers_1.EditUserPrifile);
//# sourceMappingURL=UserRouter.js.map
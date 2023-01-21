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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserPrifile = exports.GetUserProfile = exports.RequestOtp = exports.UserVerify = exports.UserLogin = exports.UserSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const utility_1 = require("../utility");
const models_1 = require("../models");
const UserSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateUserInputs, req.body);
    const InputErrors = yield (0, class_validator_1.validate)(userInputs, { validationError: { target: true } });
    if (InputErrors.length > 0) {
        return res.status(400).json(InputErrors);
    }
    const { email, phone, password } = userInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPasswrod = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const existUser = yield models_1.User.findOne({ email: email });
    if (existUser !== null) {
        return res.status(409).json({ message: "An user Exist with same email id" });
    }
    // console.log(otp+" "+expiry);
    // return res.json({message:"working"});
    const result = yield models_1.User.create({
        email: email,
        password: userPasswrod,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0
    });
    if (result) {
        // send otp
        // await onRequestOTP(otp,phone);
        //generate signature
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        //send the result to client
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
        });
    }
    return res.status(401).json({ 'message': "some error occured with sign up" });
});
exports.UserSignUp = UserSignUp;
const UserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(401).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const user = yield models_1.User.findOne({ email: email });
    if (user) {
        const validation = yield (0, utility_1.ValidatePassword)(password, user.password, user.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: user._id,
                email: user.email,
                verified: user.verified
            });
            return res.status(201).json({
                signature: signature,
                verified: user.verified,
                email: user.email,
            });
        }
        return res.status(404).json({ message: "password not matched" });
    }
    return res.status(401).json({ message: "Log in error" });
});
exports.UserLogin = UserLogin;
const UserVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    if (user) {
        const profile = yield models_1.User.findById(user._id);
        // if(profile)
        // console.log(profile.otp_expiry +" "+ profile.otp_expiry.toString() <= (new Date()).setTime(new Date().getTime()-30*60*1000).toString());
        // console.log(profile.otp_expiry.toString() >= (new Date()).toString())
        // console.log(profile.otp , otp);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry.toString() >= (new Date()).toString()) {
                profile.verified = true;
                const updatedUserResp = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedUserResp._id,
                    email: updatedUserResp.email,
                    verified: updatedUserResp.verified
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updatedUserResp.verified,
                    email: updatedUserResp.email
                });
            }
        }
        return res.status(400).json({ message: "Some error occured in verification process" });
    }
});
exports.UserVerify = UserVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield models_1.User.findById(user._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            // profile.otp_expiry = expiry;
            console.log(otp + "\n " + expiry + "\n" + new Date());
            yield profile.save();
            // await onRequestOTP(otp,profile.phone);
            res.status(200).json({ message: "OTP Sent to your registered Number" });
        }
    }
    return res.status(400).json({ message: "Some error occured in otp process" });
});
exports.RequestOtp = RequestOtp;
const GetUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(user);
    if (user) {
        const profile = yield models_1.User.findById(user._id);
        // console.log(profile);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
});
exports.GetUserProfile = GetUserProfile;
const EditUserPrifile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const profileInput = (0, class_transformer_1.plainToClass)(dto_1.EditUserProfileInput, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInput, { validationError: { target: false } });
    // console.log(profileErrors)
    // console.log(profileInput)
    if (profileErrors.length > 0) {
        return res.status(404).json({ profileErrors });
    }
    const { firstName, lastName, address } = profileInput;
    if (user) {
        const profile = yield models_1.User.findById(user._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
});
exports.EditUserPrifile = EditUserPrifile;
//# sourceMappingURL=UserController.js.map
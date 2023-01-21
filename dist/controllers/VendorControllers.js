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
exports.UpdateVendorCoverImage = exports.GetFood = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const AdminControllers_1 = require("./AdminControllers");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminControllers_1.FindVendor)('', email);
    // console.log(existingVendor);
    if (existingVendor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVendor._id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodTypes,
                name: existingVendor.name
            });
            return res.json(signature);
        }
        else {
            return res.json({ 'message': "Password not valid" });
        }
    }
    return res.json({ 'message': "Log in credential not valid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminControllers_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodTypes } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminControllers_1.FindVendor)(user._id);
        if (existingVendor) {
            const updated = yield existingVendor.update({
                name: name,
                address: address,
                phone: phone,
                foodTypes: foodTypes
            });
            // const savedResult = await existingVendor.save();
            return res.json(updated);
        }
        return res.json(existingVendor);
    }
    else {
        return res.json({
            "message": "vendor information not found"
        });
    }
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminControllers_1.FindVendor)(user._id);
        if (existingVendor) {
            const updated = yield existingVendor.update({
                serviceAvailable: !existingVendor.serviceAvailable
            });
            return res.json(updated);
        }
        return res.json(existingVendor);
    }
    else {
        return res.json({
            "message": "vendor information not found"
        });
    }
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if (user) {
        const { name, description, catagory, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminControllers_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            // console.log(files)
            const images = files.map((file) => file.filename);
            const createdFood = yield models_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                catagory: catagory,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            });
            vendor.foods.push(createdFood);
            yield vendor.save();
            // const foodarr = [...vendor.foods];
            // foodarr.push(createdFood);
            // const result = await vendor.update({
            //     foods:foodarr
            // })
            // console.log(vendor.foods);
            // Vendor.updateOne({_id:vendor._id},
            //     {$push:{foods:createdFood}});
            // console.log(vendor._id)
            return res.json(vendor);
        }
    }
    else {
        return res.json({
            "message": "vendor information not found"
        });
    }
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    else {
        return res.json({
            "message": "vendor information not found"
        });
    }
});
exports.GetFood = GetFood;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminControllers_1.FindVendor)(user._id);
        if (existingVendor) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            existingVendor.coverImages.push(...images);
            // const updated = await existingVendor.update({
            // });
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
        return res.json(existingVendor);
    }
    else {
        return res.json({
            "message": "vendor information not found"
        });
    }
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
//# sourceMappingURL=VendorControllers.js.map
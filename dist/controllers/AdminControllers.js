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
exports.GetVendorsById = exports.GetVendors = exports.CreateVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, address, pinCode, foodTypes, ownerName, password } = req.body;
    let emailexisted = yield (0, exports.FindVendor)('', email);
    if (emailexisted !== null) {
        return res.json({ "message": "User already existed" });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const saltedpass = yield (0, utility_1.GeneratePassword)(password, salt);
    const createvendor = yield models_1.Vendor.create({
        name: name,
        address: address,
        email: email,
        pinCode: pinCode,
        foodTypes: foodTypes,
        ownerName: ownerName,
        password: saltedpass,
        salt: salt,
        serviceAvailable: false,
        phone: phone,
        rating: 0,
        coverImage: [],
        foods: []
    });
    return res.json(createvendor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors != null) {
        return res.json(vendors);
    }
});
exports.GetVendors = GetVendors;
const GetVendorsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)(vendorId);
    if (vendor !== null) {
        return res.json(vendor);
    }
    return res.json({ "message": "vendors data not availiable" });
});
exports.GetVendorsById = GetVendorsById;
//# sourceMappingURL=AdminControllers.js.map
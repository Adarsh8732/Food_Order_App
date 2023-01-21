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
exports.RestaurantById = exports.SearchFoods = exports.GetFoodsIn30Min = exports.GetTopRestaurant = exports.GetFoodAvailablity = void 0;
const models_1 = require("../models");
const GetFoodAvailablity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
        .sort({ rating: -1 })
        .populate('foods');
    if (result.length > 0) {
        res.status(200).json(result);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.GetFoodAvailablity = GetFoodAvailablity;
const GetTopRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
        .sort({ rating: -1 })
        .limit(10)
        .populate('foods');
    if (result.length > 0) {
        res.status(200).json(result);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.GetTopRestaurant = GetTopRestaurant;
const GetFoodsIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
        .populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.filter((vendor) => {
            const foods = vendor.foods;
            const filtered = foods.filter((food) => {
                return food.readyTime <= 30;
            });
            foodResult.push(...filtered);
        });
        res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.GetFoodsIn30Min = GetFoodsIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
        .populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.filter((vendor) => {
            const foods = vendor.foods;
            foodResult.push(...foods);
        });
        res.status(200).json(foodResult);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.SearchFoods = SearchFoods;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id)
        .populate("foods");
    if (result) {
        res.status(200).json(result);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.RestaurantById = RestaurantById;
//# sourceMappingURL=ShoppingController.js.map
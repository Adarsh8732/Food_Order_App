"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const Router = express_1.default.Router();
exports.ShoppingRouter = Router;
Router.get('/:pincode', controllers_1.GetFoodAvailablity); //food availiable
Router.get('/top-restaurants/:pincode', controllers_1.GetTopRestaurant); //top restaurant
Router.get('/foods-in-30-min/:pincode', controllers_1.GetFoodsIn30Min); //foods available in 30 min
Router.get('/search/:pincode', controllers_1.SearchFoods); //search food
Router.get('/restaurants/:id', controllers_1.RestaurantById); //find restaurant by id
//# sourceMappingURL=ShoppingRoute.js.map
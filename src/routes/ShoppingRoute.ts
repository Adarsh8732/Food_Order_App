import express from "express"
import { GetFoodAvailablity, GetFoodsIn30Min, GetTopRestaurant, RestaurantById, SearchFoods } from "../controllers";
const  Router = express.Router();


Router.get('/:pincode',GetFoodAvailablity)//food availiable
Router.get('/top-restaurants/:pincode',GetTopRestaurant)//top restaurant
Router.get('/foods-in-30-min/:pincode',GetFoodsIn30Min)//foods available in 30 min
Router.get('/search/:pincode',SearchFoods)//search food
Router.get('/restaurants/:id',RestaurantById)//find restaurant by id

export {Router as ShoppingRouter}
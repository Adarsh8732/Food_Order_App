import {Request,Response,NextFunction} from 'express';
import { FoodDoc, Vendor } from '../models';

export const GetFoodAvailablity = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result = await Vendor.find({pinCode:pincode,serviceAvailable:true})
    .sort({rating:-1})
    .populate('foods');

    if(result.length>0){
        res.status(200).json(result);
    }
    return res.status(400).json({message:"data not found"});
}
export const GetTopRestaurant = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result = await Vendor.find({pinCode:pincode,serviceAvailable:true})
    .sort({rating:-1})
    .limit(10)
    .populate('foods')

    if(result.length>0){
        res.status(200).json(result);
    }
    return res.status(400).json({message:"data not found"});
}

export const GetFoodsIn30Min = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result = await Vendor.find({pinCode:pincode,serviceAvailable:true})
    .populate("foods")

    if(result.length>0){
        let foodResult:any= [];
        result.filter((vendor)=>{
            const foods = vendor.foods as [FoodDoc];
            const filtered = foods.filter((food)=>{
                return food.readyTime<=30;
            })
            foodResult.push(...filtered);
        })
        res.status(200).json(foodResult);
    }
    return res.status(400).json({message:"data not found"});
}

export const SearchFoods = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result = await Vendor.find({pinCode:pincode,serviceAvailable:true})
    .populate("foods")

    if(result.length>0){
        let foodResult:any= []
        result.filter((vendor)=>{
            const foods = vendor.foods as [FoodDoc];
            foodResult.push(...foods);
        })
        res.status(200).json(foodResult);
    }
    return res.status(400).json({message:"data not found"});
}

export const  RestaurantById= async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.id;
    const result = await Vendor.findById(id)
    .populate("foods")

    if(result){
        res.status(200).json(result);
    }
    return res.status(400).json({message:"data not found"});
}
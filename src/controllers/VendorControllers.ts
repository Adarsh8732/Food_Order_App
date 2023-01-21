import {Request,Response,NextFunction} from 'express';
import { EditVendorInputs, VendorLoginInput } from '../dto';
import { CreateFoodInputs } from '../dto/Food.dto';
import { Food, Vendor } from '../models';
import { GenerateSignature, ValidatePassword } from '../utility';
import { FindVendor } from './AdminControllers';

export const VendorLogin = async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password} = <VendorLoginInput>req.body;
    const existingVendor = await FindVendor('',email);
    // console.log(existingVendor);
    if(existingVendor !== null){
        const validation = await ValidatePassword(password,existingVendor.password,existingVendor.salt);
        if(validation){
            const signature = GenerateSignature({
                _id:existingVendor._id,
                email:existingVendor.email,
                foodTypes:existingVendor.foodTypes,
                name:existingVendor.name
            })
            return res.json(signature);
        }else{
            return res.json({'message':"Password not valid"});
        }
    }

    return res.json({'message':"Log in credential not valid"});
}

export const GetVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user;
    if(user){
        const existingVendor = await FindVendor(user._id);
        return res.json(existingVendor);
    }
}


export const UpdateVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if(user){
        const existingVendor = await FindVendor(user._id);
        if(existingVendor){
           
            const updated = await existingVendor.update({
                name :name,
                address :address,
                phone  : phone,
                foodTypes :foodTypes
            });
            // const savedResult = await existingVendor.save();
            return res.json(updated);
        }
        return res.json(existingVendor);
    }else{
        return res.json({
            "message":"vendor information not found"
        })
    }
}

export const UpdateVendorService = async(req:Request,res:Response,next:NextFunction)=>{
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if(user){
        const existingVendor = await FindVendor(user._id);
        if(existingVendor){
            const updated = await existingVendor.update({
                serviceAvailable :!existingVendor.serviceAvailable
            });
            return res.json(updated);
        }
        return res.json(existingVendor);
    }else{
        return res.json({
            "message":"vendor information not found"
        })
    }
}

export const AddFood = async(req:Request,res:Response,next:NextFunction)=>{
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if(user){
        const {name,description,catagory,foodType,readyTime,price} = <CreateFoodInputs>req.body;
        const vendor = await FindVendor(user._id);

        if(vendor !== null){
            const files = req.files as [Express.Multer.File];
            // console.log(files)

            const images = files.map((file:Express.Multer.File)=> file.filename)
            const createdFood = await Food.create({
                vendorId:vendor._id,
                name:name,
                description:description,
                catagory:catagory,
                foodType:foodType,
                images:images,
                readyTime:readyTime,
                price:price,
                rating:0
            })

            vendor.foods.push(createdFood);
            await vendor.save();

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

    }else{
        return res.json({
            "message":"vendor information not found"
        })
    }

}



export const GetFood = async(req:Request,res:Response,next:NextFunction)=>{
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if(user){
        const foods = await Food.find({vendorId : user._id});
        if(foods!==null){
            return res.json(foods);
        }
    }else{
        return res.json({
            "message":"vendor information not found"
        })
    }
}




export const UpdateVendorCoverImage = async(req:Request,res:Response,next:NextFunction)=>{
    // const {name,address,phone,foodTypes} = <EditVendorInputs>req.body;
    const user = req.user;
    if(user){
        const existingVendor = await FindVendor(user._id);
        if(existingVendor){
            
            const files = req.files as [Express.Multer.File];
            const images = files.map((file:Express.Multer.File)=>file.filename);
            existingVendor.coverImages.push(...images);
            
            // const updated = await existingVendor.update({
            // });

            const savedResult = await existingVendor.save();
            return res.json(savedResult);
        }
        return res.json(existingVendor);
    }else{
        return res.json({
            "message":"vendor information not found"
        })
    }
}
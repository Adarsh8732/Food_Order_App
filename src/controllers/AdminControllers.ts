import { Request,Response,NextFunction } from "express";
import mongoose from "mongoose";
import { createVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


export const FindVendor = async (id:string|undefined , email?:string)=>{
    if(email){
        return await Vendor.findOne({email : email});
    }else{
        return await Vendor.findById(id);
    }
}


export const CreateVendor =async (req:Request,res:Response,next:NextFunction) => {
    const {name,email,phone,address,pinCode,foodTypes,ownerName,password} = <createVendorInput>req.body;

    let emailexisted = await FindVendor('',email);
    if(emailexisted!==null){
        return res.json({"message":"User already existed"});
    }
    const salt = await GenerateSalt();
    const saltedpass = await GeneratePassword(password,salt);
    const createvendor = await Vendor.create({
        name:name,
        address:address,
        email:email,
        pinCode:pinCode,
        foodTypes:foodTypes,
        ownerName:ownerName,
        password:saltedpass,
        salt:salt,
        serviceAvailable:false,
        phone:phone,
        rating:0,
        coverImage:[],
        foods:[]
    })
    return res.json(createvendor);
}

export const GetVendors =async (req:Request,res:Response,next:NextFunction) => {
    const vendors = await Vendor.find();
    if(vendors!=null){
        return res.json(vendors);
    }
}


export const GetVendorsById =async (req:Request,res:Response,next:NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await FindVendor(vendorId);
    if(vendor !== null){
        return res.json(vendor);
    }
    return res.json({"message":"vendors data not availiable"});

}
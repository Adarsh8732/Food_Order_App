import express,{Request,Response,NextFunction} from 'express';
import {plainToClass} from "class-transformer";
import { validate, Validate } from 'class-validator';
import { CreateUserInputs, EditUserProfileInput, UserLoginInputs } from '../dto';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, ValidatePassword, ValidateSignature } from '../utility';
import { User } from '../models';
export const UserSignUp = async(req:Request,res:Response,next:NextFunction)=>{
    const userInputs = plainToClass(CreateUserInputs,req.body);
    const InputErrors = await validate(userInputs,{validationError:{target:true}});
    if(InputErrors.length>0){
        return res.status(400).json(InputErrors);

    }
    const {email,phone,password} = userInputs;

    const salt = await GenerateSalt();
    const userPasswrod = await GeneratePassword(password,salt);
    const {otp,expiry} = GenerateOtp()


    const existUser = await User.findOne({email:email});

    if(existUser !== null){
        return res.status(409).json({message:"An user Exist with same email id"});
    }

    // console.log(otp+" "+expiry);
    // return res.json({message:"working"});
    const result = await User.create({
        email:email,
        password:userPasswrod,
        salt:salt,
        phone:phone,
        otp :otp,
        otp_expiry:expiry,
        firstName:"",
        lastName:"",
        address:"",
        verified:false,
        lat:0,
        lng:0
    })

    if(result){

        // send otp
        // await onRequestOTP(otp,phone);
        //generate signature
        const signature = GenerateSignature({
            _id:result._id,
            email:result.email,
            verified : result.verified
        })
        //send the result to client

        return res.status(201).json({
            signature:signature,
            verified:result.verified,
            email:result.email,
        })
    }
    return res.status(401).json({'message':"some error occured with sign up"});
}


export const UserLogin  = async(req:Request,res:Response,next:NextFunction)=>{
    const loginInputs = plainToClass(UserLoginInputs,req.body);

    const loginErrors = await validate(loginInputs,{validationError:{target:false}});

    if(loginErrors.length>0){
        return res.status(401).json(loginErrors);
    }
    const {email,password} = loginInputs;
    const user = await User.findOne({email:email});
    if(user){
        const validation = await ValidatePassword(password,user.password,user.salt);
        if(validation){
            const signature = GenerateSignature({
                _id:user._id,
                email:user.email,
                verified : user.verified
            })

            return res.status(201).json({
                signature:signature,
                verified:user.verified,
                email:user.email,
            })
        }
        return res.status(404).json({message:"password not matched"});
    }
    return res.status(401).json({message:"Log in error"});
}


export const UserVerify = async(req:Request,res:Response,next:NextFunction)=>{
    const {otp} = req.body;

    const user = req.user;

    if(user){
        const profile = await User.findById(user._id);
            // if(profile)
            // console.log(profile.otp_expiry +" "+ profile.otp_expiry.toString() <= (new Date()).setTime(new Date().getTime()-30*60*1000).toString());
            // console.log(profile.otp_expiry.toString() >= (new Date()).toString())
            // console.log(profile.otp , otp);

        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry.toString() >= (new Date()).toString()){
                profile.verified = true;

                const updatedUserResp = await profile.save();

                const signature = GenerateSignature({
                    _id:updatedUserResp._id,
                    email:updatedUserResp.email,
                    verified:updatedUserResp.verified
                })

                return res.status(201).json({
                    signature:signature,
                    verified:updatedUserResp.verified,
                    email:updatedUserResp.email
                });
            }
        }
        return res.status(400).json({message:"Some error occured in verification process"});
    }
}

export const RequestOtp = async(req:Request,res:Response,next:NextFunction)=>{
    
    const user = req.user;

    if(user){
        const profile = await User.findById(user._id);
        if(profile){
            const{otp,expiry} = GenerateOtp();

            profile.otp  = otp;
            // profile.otp_expiry = expiry;
            console.log(otp+"\n "+expiry+"\n"+new Date());
            await profile.save();

            // await onRequestOTP(otp,profile.phone);

            res.status(200).json({message:"OTP Sent to your registered Number"});
        }
    }
    return res.status(400).json({message:"Some error occured in otp process"});
}


export const GetUserProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user;
    // console.log(user);
    if(user){
        const profile = await User.findById(user._id);
        // console.log(profile);
        if(profile){
            return res.status(200).json(profile);
        }
    }
}


export const EditUserPrifile = async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user;
    const profileInput = plainToClass(EditUserProfileInput,req.body);

    const profileErrors = await validate(profileInput,{validationError:{target:false}});
    // console.log(profileErrors)
    // console.log(profileInput)
    if(profileErrors.length>0){
        return res.status(404).json({profileErrors})
    }

    const {firstName,lastName,address} = profileInput;

    if(user){
        const profile = await User.findById(user._id);
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save();
            return res.status(200).json(result);
        }
    }
}


import { AuthPayload } from "../dto/Auth.dto";
import { Request,Response,NextFunction } from "express";
import { ValidatePassword, ValidateSignature } from "../utility";
// export const a = 10;
declare global{
    namespace Express{
        interface Request{
            user?:AuthPayload
        }
    }
}

export const Authenticate =  (req:Request,res:Response,next:NextFunction) => {
    const validate = ValidateSignature(req);
    if(validate){
        // console.log("validated")
        next();
    }else{
        return res.json({'message':"user not authoreized"})
    }
}
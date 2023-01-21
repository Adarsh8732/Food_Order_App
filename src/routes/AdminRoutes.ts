import express,{Request,Response,NextFunction} from "express"
import { CreateVendor, GetVendors, GetVendorsById } from "../controllers";

const Router = express.Router();

Router.post('/vendor',CreateVendor);
Router.get('/vendors',GetVendors);
Router.get('/vendor/:id',GetVendorsById);

Router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    console.clear();
    return res.json({"message":"Hello from admin route"});
})


export {Router as AdminRoute}
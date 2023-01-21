import express,{Request,Response,NextFunction} from "express"
import { AddFood, GetFood, GetVendorProfile, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers";
import { Authenticate } from "../middlewares";
import multer from 'multer';
const  Router = express.Router();

const imageStorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./images')
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})

const images = multer({storage:imageStorage}).array('images',10);


Router.post('/login',VendorLogin);

Router.use(Authenticate)
Router.get('/profile',GetVendorProfile);
Router.patch('/profile',UpdateVendorProfile);
Router.patch('/coverImage',images,UpdateVendorCoverImage);
Router.patch('/service',UpdateVendorService);

Router.post('/food',images,AddFood);
// Router.post('/food',AddFood);
Router.get('/foods',GetFood)


Router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    return res.json({"message":"Hello from vendor route"});
})


export {Router as VendorRoute}
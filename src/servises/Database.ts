import mongoose from 'mongoose';
import { MONGO_URL } from '../config';

export default async ()=>{
    mongoose.set('strictQuery',false); 
    try {
        await mongoose.connect(MONGO_URL, {
            // useNewUrlParser:true,
            // useUnifiedTopology:true,
            // useCreateIndex:true
        })
        console.log("db Connected")        
    } catch (error) {
        console.log("err"+ error);
    }
}

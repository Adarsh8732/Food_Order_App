import express from 'express';
import App from './servises/ExpressApp';
import DBConnection from './servises/Database';
import { PORT } from './config';


const StartServer = async()=>{
    const app = express();
    await DBConnection();
    await App(app);
    app.listen(PORT,()=>{
        console.log(`Listening to port ${PORT}`);
    })
}

StartServer();
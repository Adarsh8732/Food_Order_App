import express from 'express';
import { EditUserPrifile, GetUserProfile, RequestOtp, UserLogin, UserSignUp, UserVerify } from '../controllers';
import { Authenticate } from '../middlewares';

const Router = express.Router();

Router.post('/signup',UserSignUp);

Router.post('/login',UserLogin);

Router.use(Authenticate)

Router.patch('/verify',UserVerify);

Router.get('/otp',RequestOtp);

Router.get('/profile',GetUserProfile);

Router.patch('/profile',EditUserPrifile);

export {Router as UserRouter};
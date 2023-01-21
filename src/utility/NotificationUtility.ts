


// OTP

import { ACCOUNTSID, AUTHTOKEN } from "../config";

export const GenerateOtp = ()=>{
    const otp = Math.floor(100000 + Math.random()*900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime()+30*60*1000)
    return {otp,expiry};
}

export const onRequestOTP = async(otp:number,toPhoneNumber:string)=>{
    const accountSid = ACCOUNTSID;
    const authToken = AUTHTOKEN;

    const client = require('twilio')(accountSid,authToken);

    const response = await client.messages.create({
        body:`Your OTP is ${otp}`,
        from:'+12183095832',
        to:`+91${toPhoneNumber}`
    })
    return response;
}



// OTP

export const GenerateOtp = ()=>{
    const otp = Math.floor(100000 + Math.random()*900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime()+30*60*1000)
    return {otp,expiry};
}

export const onRequestOTP = async(otp:number,toPhoneNumber:string)=>{
    const accountSid = "ACfc038ed92a85c481dc1eef940d9fd19c";
    const authToken ="421e22d4a889b7b0bc341ec0fba4ac6b";

    const client = require('twilio')(accountSid,authToken);

    const response = await client.messages.create({
        body:`Your OTP is ${otp}`,
        from:'+12183095832',
        to:`+91${toPhoneNumber}`
    })
    return response;
}
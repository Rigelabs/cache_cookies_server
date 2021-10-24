const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { customAlphabet } = require('nanoid/non-secure');
const env = require('dotenv');
const redisClient = require('./redis');
env.config();

const nanoid = customAlphabet('1234567890ABCDEF', 6)

const SNS_Client = new SNSClient({ region: process.env.AWS_REGION,
                                    credentials:({
                                        AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID,
                                        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
                                    }) 
                                })

async function sendOTP(mobileno) {
    const mobileNo = mobileno;
    const otp_code = nanoid();
    console.log(otp_code)
    const params = {
        Message: `Welcome! your mobile verification code is: ${otp_code}. Mobile Number is: ${mobileNo}`,
        PhoneNumber: mobileNo,
    };
    try {
        const data= await SNS_Client.send(new PublishCommand(params));
        if(data){
            await redisClient.set(mobileNo.toString(),JSON.stringify({redisCode:otp_code}),exp,60)

        }
        return console.log("OTP sent", data)
    } catch (err) {
            return console.log(err.stack)
    
    }
   
    
}

module.exports = sendOTP;

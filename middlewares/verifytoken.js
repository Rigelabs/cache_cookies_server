const http = require('http');
const { URL } = require('url');
const AT_Sms = require('./africaTalking');
const sendOTP = require('./aws_sns');
const logger = require('./logger');
const twilioSMS = require('./twilioSMS');
//call auth backend to verify the token

async function verifyToken(req, res,next) {
   
    //request user data from user api
    const requestUrl = new URL(
        `${process.env.AUTH_BACKEND}/verify`
    )
    if(req.headers["authorization"]){
    const reqData = http.get({ hostname: requestUrl.hostname, path: requestUrl.pathname,port:requestUrl.port, 
        headers: {"Authorization":req.headers["authorization"]} ,method:"POST" }, 
        
        response => {
       
        response.on("data", d => {
           
            if (response.statusCode===200) {
                 next();
            }else{
                return res.status(400).json(response.statusMessage)
            }

        })
    })
    reqData.on('error', error => {
        
        logger.error(error)
    })
    reqData.end();
}else{
    return(res.status(401).json({message: "Invalid Request"}))
}
    
}
module.exports = verifyToken;
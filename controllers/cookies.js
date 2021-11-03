const env = require('dotenv');
const logger = require("../middlewares/logger");
const Joi= require('joi');
const { cookieConnection } = require('../middlewares/mongoose');
const redisClient = require('../middlewares/redis');
const sendOTP = require('../middlewares/aws_sns');

env.config();

const uiSchema= Joi.object({
    setBy:Joi.string(),
    lightMode:Joi.string(),
    font: Joi.string(),
    language:Joi.string()
})

async function uiSettings(req,res){
    try {
        
  await uiSchema.validateAsync(req.body).then(()=>{

    const entries =Object.keys(req.body)
    
    const updates= {};
    //updating the fields dynamically
    for(let i=0; i<entries.length; i++){
        updates[entries[i]] = Object.values(req.body)[i]
    }
    
    const cookieCollection =cookieConnection.collection('settings')
    
     cookieCollection.updateOne({"setBy":req.params.user_id}, {
        $set:updates
    }, {upsert: true}).then((success,err)=>{
       
        if(err) return logger.error(err.message)
        if(success) return( res.status(200).json({message:" cookies updated successfully"}),
                            logger.info({message:" cookies updated successfully"}))
        
    })
    

})

.catch(err=>{return res.status(400).json({message:err.message})});
    } catch (error) {
        res.status(400).json({message:error})
    }
}
async function getUISettings(req,res){
    try {
        const cookieCollection = cookieConnection.collection("settings")
        await redisClient.get(`${req.params.user_id}uiSettings`, (err,data)=>{
            if (err) return logger.error(err);
            if (data) {
                return res.status(200).json(JSON.parse(data));
            } else {
                cookieCollection.find({setBy:req.params.user_id}).toArray(function(err,result){
                    if (err) return (res.status(501).json({ message: err.message }), logger.error(err))
                    if (result) {
                        //save to redis
                        redisClient.set(`${req.params.user_id}uiSettings`, JSON.stringify(result), "EX", 60, (err) => {
                            if (err) return res.status(400).json({ message: err })
                            return res.status(200).json({ result });
                        })

                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({message:error})
    }
}
async function getAllUISettings(req,res){
    try {
        const cookieCollection = cookieConnection.collection("settings")
        await redisClient.get('uiSettings', (err,data)=>{
            if (err) return logger.error(err);
            if (data) {
                return res.status(200).json(JSON.parse(data));
            } else {
                cookieCollection.find().toArray(function(err,result){
                    if (err) return (res.status(501).json({ message: err.message }), logger.error(err))
                    if (result) {
                        //save to redis
                        redisClient.set('uiSettings', JSON.stringify(result), "EX", 60, (err) => {
                            if (err) return res.status(400).json({ message: err })
                            return res.status(200).json({ result });
                        })

                    }
                })
            }
        })
    } catch (error) {
        return (res.status(400).json({message:error}))
    }
}
module.exports = {uiSettings,getUISettings,getAllUISettings};
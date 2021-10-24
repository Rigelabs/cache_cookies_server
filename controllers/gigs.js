const {gigsConnection} = require('../middlewares/mongoose')
const mongoose = require('mongoose');
const logger = require('../middlewares/logger');
const redisClient = require('../middlewares/redis');

const FlagsSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
       
    },
    
    status: {
        type: String,
        default: 'OPEN',
        enum:['RESOLVED','CLOSED','OPEN','ASSIGNED','PENDING']
    },
    road: {
        type: String,
        required: true,
    },
   
    observation: {
        type: String,
      
    },
    resolution: {
        type: String,
      
    },
    assignedTo: {
        type: String,
      
    },


    closure: {
        type: String,
     
    },
    manhole: {
        type: String,
        required: true,
    },
    ring:{
        type: String,
        required: true,
        enum:['RING 1','RING 2','RING 3','RING 4','RING 9','RING 10','CLUSTER 1','CLUSTER 2']
    },
    
    imagesBefore:{
        type: Array, 
        required: true,       
    },
    imagesAfter:{
        type: Array,        
    },
    updatedBy:{
        type: String,        
    },
    coordinates: {
       
          type: String, 
          
    },
    ticketNumber: {
       unique:true,
        type: String, 
        
  },
        
    user: {
        type:String
    },
    updatedBy: {
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
const gigsCache=async(req,res,next)=>{
   try {
       
   
  
    const gigsModel= gigsConnection.model("flags",FlagsSchema)
    
    //check for the cache on the redis server
    
    await redisClient.get("gigs", (err,result)=>{
        
        if(err) return logger.error(err);
        if(result){
            return res.status(200).json({data: JSON.parse(result)});
        }else{
            //get from mongo
             gigsModel.find().sort({updatedAt:-1}).then((data,err)=>{
                 if(err) return res.status(400).json({message: err.message})
                //save to redis
                redisClient.set("gigs",JSON.stringify(data),"EX",60*5, (err)=>{
                    if(err) return res.status(400).json({message: err})
                    return res.status(200).json({data: data});
                })
            })
        }
    })
  
    

   } catch (error) {
       logger.error(error)
   }
   
}


module.exports = gigsCache;

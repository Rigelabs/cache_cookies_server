const env = require('dotenv');
const logger = require("../middlewares/logger");
const Joi= require('joi');
const { cookieConnection } = require('../middlewares/mongoose');

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

module.exports = uiSettings;
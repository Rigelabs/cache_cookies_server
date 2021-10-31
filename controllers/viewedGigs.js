const { cookieConnection } = require('../middlewares/mongoose');

const env = require('dotenv');
const logger = require("../middlewares/logger");
const Joi = require('joi');
const redisClient = require('../middlewares/redis');

env.config();




const viewedGigsSchema = Joi.object({
    viewedBy: Joi.string(),
    gig_id: Joi.string(),
    gig_cost: Joi.number(),
    gig_owner: Joi.string(),
    gig_location: Joi.string(),
    location: Joi.string()
})

async function viewedGigs(req, res) {
    
    try {

        await viewedGigsSchema.validateAsync(req.body).then(() => {

            const entries = Object.keys(req.body)

            const updates = {};
            //updating the fields dynamically
            for (let i = 0; i < entries.length; i++) {
                updates[entries[i]] = Object.values(req.body)[i]
            }

            const cookieCollection = cookieConnection.collection('viewedGigs')

            cookieCollection.updateOne({ "gig_id": req.params.gig_id }, {
                $set: updates
            }, { upsert: true }).then((success, err) => {

                if (err) return logger.error(err.message)
                if (success) return (res.status(200).json({ message: " cookies updated successfully" }),
                    logger.info({ message: " cookies updated successfully" }))

            })


        }).catch(err => { return res.status(400).json({ message: err.message }) });
    } catch (error) {
        res.status(400).json({ message: error })
    }
}

async function allViewedGigs(req, res) {

    try {
        const cookieCollection = cookieConnection.collection('viewedGigs')
        //check if data in redis
        await redisClient.get("viewedGigs", (err, result) => {

            if (err) return logger.error(err);
            if (result) {
                return res.status(200).json(JSON.parse(result));
            } else {
                cookieCollection.find().toArray(function (err, data) {
                    if (err) return (res.status(501).json({ message: err.message }), logger.error(err), console.log(err))
                    if (data) {
                        //save to redis
                        redisClient.set("viewedGigs", JSON.stringify(data), "EX", 60 * 5, (err) => {
                            if (err) return res.status(400).json({ message: err })
                            return res.status(200).json({ data });
                        })

                    }
                })
            }
        })


    } catch (error) {
        console.log(error.message)
    }


}
async function GigsByUser(req, res) {
    const viewedBy= req.params.user_id
    if(viewedBy){
    try {
        const cookieCollection = cookieConnection.collection('viewedGigs')
        //check if data in redis
        await redisClient.get(`${viewedBy}_viewedGigs`, (err, result) => {

            if (err) return logger.error(err);
            if (result) {
                return res.status(200).json(JSON.parse(result));
            } else {
                cookieCollection.find({"viewedBy":viewedBy}).toArray(function (err, data) {
                    if (err) return (res.status(501).json({ message: err.message }), logger.error(err), console.log(err))
                    if (data) {
                        //save to redis
                        redisClient.set(`${viewedBy}_viewedGigs`, JSON.stringify(data), "EX", 60 * 60, (err) => {
                            if (err) return res.status(400).json({ message: err })
                            return res.status(200).json({ data });
                        })

                    }
                })
            }
        })


    } catch (error) {
        console.log(error.message)
    }
}else{
    res.status(401).json({message:"Invalid request"})
}

}
module.exports = { viewedGigs, allViewedGigs,GigsByUser };


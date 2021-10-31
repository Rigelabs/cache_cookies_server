const mongoose = require('mongoose');
const env = require('dotenv');
const logger = require('./logger');


env.config();

//connecting to cookies DB
const cookieConnection =   mongoose.createConnection(process.env.COOKIE_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
cookieConnection.once("open",function(){
 console.log("Connected to Cookie DB")
 })
 cookieConnection.on('disconnected', err => {
     console.log('Cookie DB disconnected'),
         logger.error('Cookie DB disconnected',err)
 })
 cookieConnection.on('reconnected', err => {
     console.log('Cookie DB reconnected'),
         logger.info('Cookie DB reconnected')
 })
 cookieConnection.on('error', err => {
     console.log('Cookie DB Error', err),
         logger.error('Flags DB Error', err)
 })

    //connecting to gigs db
  
   const gigsConnection =   mongoose.createConnection(process.env.FLAGS_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   gigsConnection.once("open",function(){
    console.log("Connected to Gigs DB")
    })
    gigsConnection.on('disconnected', err => {
        console.log('Gigs DB disconnected'),
            logger.error('Gigs DB disconnected',err)
    })
    gigsConnection.on('reconnected', err => {
        console.log('Gigs DB reconnected'),
            logger.info('Gigs DB reconnected')
    })
    gigsConnection.on('error', err => {
        console.log('Gigs DB Error', err),
            logger.error('Gigs DB Error', err)
    })

   
    
    module.exports= {gigsConnection,cookieConnection};


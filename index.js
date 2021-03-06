const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('dotenv');
const logger = require('./middlewares/logger');
const process = require('process');
const AT_Sms = require('./middlewares/africaTalking');


const app = express()
// Cross-origin resource sharing (CORS) is a mechanism that allows 
//restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
const corsOptions={
  origin: process.env.GIGS_FRONTEND_URL
}
app.use(cors(corsOptions));


//initialize bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//environment variable
env.config();


//Helmet helps you secure your Express apps by setting various HTTP headers.
//The top-level helmet function is a wrapper around 15 smaller middlewares, 11 of which are enabled by default.
app.use(helmet());



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port  ${PORT}`),
  //AT_Sms(process.env.AFRICAS_TALKING_PHONE_NUMBER,`Server running in ${process.env.NODE_ENV} on port  ${PORT}`)
  //twilioSMS(`Server running in ${process.env.NODE_ENV} on port  ${PORT}`,"+254720422288")
    logger.info(`Server running in ${process.env.NODE_ENV} on port  ${PORT}`)
})


//Routes
const gigsRoutes= require('./routes/gigs');
const cookieRoutes = require('./routes/cookies');
const twilioSMS = require('./middlewares/twilioSMS');

app.use('/api/gigs', gigsRoutes.routes);
app.use('/api/cookies',cookieRoutes.routes);

// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send('Server Error!');
  //AT_Sms(process.env.AFRICAS_TALKING_PHONE_NUMBER,`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

// Capture 404 erors
app.use((req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");
  logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})



//uncaughtException to crash the nodejs process
process.on('unhandledRejection', (err, origin) => {
  logger.error('Unhandled rejection at ', origin, `reason: ${err}`)
  AT_Sms(process.env.AFRICAS_TALKING_PHONE_NUMBER,'Unhandled rejection at ', origin, `reason: ${err}`)
  console.log('Unhandled rejection at ', origin, `reason: ${err}`)

})
//The 'rejectionHandled' event is emitted whenever a Promise has been rejected
// and an error handler was attached to it (using promise.catch(), for example) later than one turn of the Node.js event loop.
process.on('rejectionHandled', (err, origin) => {
  logger.error('RejectionHandled at ', origin, `reason: ${err}`)
  console.log('RejectionHandled at ', origin, `reason: ${err}`)

})
//The 'exit' event is emitted when the Node.js process is about to exit as a result of either:
//The process.exit() method being called explicitly;
//The Node.js event loop no longer having any additional work to perform.
process.on('exit', (err, origin) => {
  logger.error('Process Exited !! ', origin, `reason: ${err}`)
  AT_Sms(process.env.AFRICAS_TALKING_PHONE_NUMBER,'Process Exited !! ', origin, `reason: ${err}`)
  console.log('Process Exited !! ', origin, `reason: ${err}`)

})

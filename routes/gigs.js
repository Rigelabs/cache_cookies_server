const express = require('express');
const gigsCache = require('../controllers/gigs');
const requestLimiter= require("../middlewares/rateLimiters/genericLimiter")
const router = express.Router();


router.get('/gigs',requestLimiter, gigsCache)


module.exports = {routes: router};


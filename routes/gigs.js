const express = require('express');
const gigsCache = require('../controllers/gigs');
const requestLimiter= require("../middlewares/rateLimiters/genericLimiter");
const verifyToken = require('../middlewares/verifytoken');
const router = express.Router();


router.get('/',requestLimiter,verifyToken, gigsCache)


module.exports = {routes: router};


const express = require('express');
const uisettings = require('../controllers/cookies');
const { viewedGigs, allViewedGigs, GigsByUser } = require('../controllers/viewedGigs');
const requestLimiter= require("../middlewares/rateLimiters/genericLimiter");
const verifyToken = require('../middlewares/verifytoken');
const router = express.Router();


router.put('/uisettings/:user_id',requestLimiter, uisettings)
router.put('/viewedGigs/:gig_id',requestLimiter, viewedGigs)
router.get('/viewedGigs/all',requestLimiter,verifyToken, allViewedGigs)
router.get('/viewedGigs/:user_id',requestLimiter, verifyToken,GigsByUser)
module.exports = {routes: router};


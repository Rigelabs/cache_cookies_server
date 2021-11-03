const express = require('express');
const {uiSettings, getUISettings, getAllUISettings} = require('../controllers/cookies');
const { viewedGigs, allViewedGigs, GigsByUser } = require('../controllers/viewedGigs');
const requestLimiter= require("../middlewares/rateLimiters/genericLimiter");
const verifyToken = require('../middlewares/verifytoken');
const router = express.Router();


router.put('/uisettings/:user_id',requestLimiter,verifyToken, uiSettings);
router.get('/uisettings/:user_id',requestLimiter,verifyToken,getUISettings);
router.get('/uisettings/all',requestLimiter,verifyToken,getAllUISettings);
router.put('/viewedGigs/:gig_id',requestLimiter,verifyToken, viewedGigs);
router.get('/viewedGigs/all',requestLimiter,verifyToken, allViewedGigs);
router.get('/viewedGigs/:user_id',requestLimiter, verifyToken,GigsByUser);

module.exports = {routes: router};


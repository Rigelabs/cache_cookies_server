const mongoose = require('mongoose');

const viewedGigsSchema = new mongoose.Schema({
    viewedBy:String,
    gig_id:String,
    gig_cost: Number,
    gig_owner: String,
    gig_location:String,
    location:String
})

module.exports = mongoose.model("ViewedGigs",viewedGigsSchema)
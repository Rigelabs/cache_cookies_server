const mongoose = require('mongoose');

const UISchema = new mongoose.Schema({
    setBy:String,
    lightMode:String,
    font: String,
      
},{timestamps:true})

module.exports = mongoose.model("UI",UISchema)
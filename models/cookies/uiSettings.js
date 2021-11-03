const mongoose = require('mongoose');

const UISchema = new mongoose.Schema({
    setBy:{type:String},
    lightMode:{type:String,default:"light"},
    font: {type:String,default:"12px"},
    language:{type:String,default:"English"}
      
},{timestamps:true})

module.exports = mongoose.model("UI",UISchema)
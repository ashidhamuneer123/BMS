const mongoose = require('mongoose')
const postSchema =new mongoose.Schema ({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    comments:{
        type:Object,
        default:{}
    }
},{
    timestamps:true
})

module.exports=mongoose.model('post',postSchema)
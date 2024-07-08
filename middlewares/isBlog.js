const blogSetting= require('../models/blogSettingModel');

const isBlog= async (req,res,next)=>{
    try {
        const blog =await blogSetting.find({})
        if(blog.length===0 && req.originalUrl != '/blog-setUp'){
            res.redirect('/blog-setUp')
        }else{
            next()
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    isBlog
}
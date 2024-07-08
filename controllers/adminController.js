const blog=require('../models/blogSettingModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt')
const Post = require('../models/postModel')

const securePassword=async(password)=>{
    try {

        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash
        
    } catch (error) {
        console.log(console.error);
    }
}

const blogSetUp=async (req,res)=>{
    try {
        const blogSet=await blog.find({})
        if(blogSet.length > 0){
            res.redirect('/login')
        }else{
            res.render('blogSetUp')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const blogSetUpSave =async (req,res)=>{
    try {
        const blog_title =req.body.blog_title;
        const blog_image=req.file.filename;
        const description=req.body.description;
        const name=req.body.name;
        const email=req.body.email;
        const password=await securePassword(req.body.password);

        const blogSetting =  new blog({
            blog_title:blog_title,
            blog_logo:blog_image,
            description:description
        })
        await blogSetting.save();

        const user = new User({
            name:name,
            email:email,
            password:password,
            isAdmin:1
        })
       const userData = await user.save();
       if(userData){
            res.redirect('/login')
       }else{
            res.render('blogSetUp',{message:'Error encountered while setting up the blog!!Please try again!!'})
       }
    } catch (error) {
        console.log(error.message);
    }
}

const dashboard = async(req,res)=>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

const loadCreatePost = async(req,res)=>{
    try {
        res.render('admin/createpost')
    } catch (error) {
        console.log(error.message);
    }
}

const createPost = async(req,res)=>{
    try {
       
        var image = ""
        if(req.body.image !== undefined){
            image = req.body.image
        }
        const title=req.body.title;
        const content=req.body.content;
        
        const createPost = new Post({
            title:title,
            content:content,
            image:image
        })
        createPost.save();
        res.render('admin/createpost',{message:'New Post Added!!!!'})
    } catch (error) {
        console.log(error.message);
    }
}


const imageUpload=async (req,res)=>{
    try {
        var imagePath='/images';
        imagePath = imagePath +'/'+ req.file.filename;
        res.send({success:true , message : 'Image Uploaded',path:imagePath})
        
    } catch (error) {
        res.send({success:false,message:error.messsage})
    }
}


module.exports={
    blogSetUp,
    blogSetUpSave,
    dashboard,
    loadCreatePost,
    createPost,
    imageUpload
}
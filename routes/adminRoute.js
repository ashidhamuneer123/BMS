const express = require('express');
const session = require('express-session')
const config = require('../config/config')
const admin_route = express();
const adminController = require('../controllers/adminController')
const multer = require('multer')
const path = require('path')
const adminAuth=require('../middlewares/adminAuth')
admin_route.use(express.json())
admin_route.use(express.urlencoded({extended:true}))

admin_route.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views')

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
})

const upload =multer({
    storage:storage
})


admin_route.get('/blog-setUp',adminController.blogSetUp);
admin_route.post('/blog-setUp',upload.single('blog_image'),adminController.blogSetUpSave);

admin_route.get('/dashboard',adminAuth.isLogin,adminController.dashboard);
admin_route.get('/createpost',adminAuth.isLogin,adminController.loadCreatePost)
admin_route.post('/createpost',adminAuth.isLogin,adminController.createPost);

admin_route.post('/upload-post-image',upload.single('image'),adminAuth.isLogin,adminController.imageUpload)


module.exports=admin_route;
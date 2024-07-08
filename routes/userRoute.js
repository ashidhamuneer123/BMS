const express = require('express');
const user_route = express();
const userController = require('../controllers/userController');
const session = require('express-session')
const config = require('../config/config')
const adminAuth=require('../middlewares/adminAuth')

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))

user_route.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

user_route.set('view engine','ejs')
user_route.set('views','./views')

user_route.use(express.static('public'));

user_route.get('/login',adminAuth.isLogout,userController.loadLogin)
user_route.post('/login',userController.verifyLogin)
user_route.get('/logout',adminAuth.isLogin,userController.logout)
user_route.get('/forget-password',adminAuth.isLogout,userController.loadForgetPassword)
user_route.post('/forget-password',userController.forgetPasswordVerification)
user_route.get('/reset-password',userController.loadResetPassword)
user_route.post('/reset-password',userController.resetPassword)
user_route.get('/profile',userController.profile)


module.exports=user_route;
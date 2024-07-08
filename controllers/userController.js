 const User=require('../models/userModel')
 const bcrypt =require('bcrypt')
 const nodemailer=require('nodemailer')
const randomstring=require('randomstring')
const config = require('../config/config')

const securePassword=async(password)=>{
    try {

        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash
        
    } catch (error) {
        console.log(console.error);
    }
}

const sendResetPasswordMail=async(name,email,token)=>{
    try {

      const transporter =  nodemailer.createTransport({
            service:'GMAIL',
            auth:{
                user:config.user,
                pass:config.password
            }
        })

        const mailOptions = {
            from:config.user,
            to:email,
            subject:"Reset your BMS Password",
            html:"<p>Hi" + name + ",Your token for reseting your password is:" + token +"<p>"
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }else{
                console.log("email sent", info.response);
            }
        })

        
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email:email})
        if(user){
            const passwordMatch=await bcrypt.compare(password,user.password)
            if(passwordMatch){
                req.session.user_id=user._id;
                req.session.isAdmin=user.isAdmin
                if(user.isAdmin == 1){
                    res.redirect('/dashboard')
                }else{
                    res.redirect('/profile')
                }
            }else{
                res.render('login',{message:'Incorrect email or password'})
            }
        }else{
            res.render('login',{message:'Incorrect email or password'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

const loadForgetPassword = async(req,res)=>{
    try {
        res.render('forget-password')
    } catch (error) {
        console.log(error.message);
    }
}
const forgetPasswordVerification = async(req,res)=>{
    try {
      const email=req.body.email;
      const user = await User.findOne({email:email});
      if(user){
        const randomString = randomstring.generate();
        await User.updateOne({email:email},{$set:{token:randomString}})
        const token = randomString
        const name=user.name
        await sendResetPasswordMail(name,email,token)
        res.redirect('/reset-password')
      }else{
        res.render('forget-password',{message:"Email not found!!!"})
      }
    } catch (error) {
        console.log(error.message);
    }
}

const loadResetPassword=async(req,res)=>{
    try {
        res.render('reset-password')
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword=async(req,res)=>{
    try {
        const token = req.body.token;
        const newPassword = await securePassword(req.body.newpassword);
        const user = await User.findOne({token:token})
        
          try {
             const updatedUser=await User.findOneAndUpdate({token:token},{$set:{password:newPassword , token:""}})
            
             if (!updatedUser) {
                return res.status(500).render('reset-password', { message: 'Error updating password' });
              }

              res.redirect('/login')
            } catch (error) {
            console.log(error.message);
            return res.status(500).render('reset-password', { message: 'Error updating password' });
          }
          
        } catch (error) {
        console.log(error.message);
        return res.status(500).render('reset-password', { message: 'Internal server error' });
    }
}

const profile = async(req,res)=>{
    try {
        res.send('profile')
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadLogin,
    verifyLogin,
    logout,
    loadForgetPassword,
    forgetPasswordVerification,
    loadResetPassword,
    resetPassword,
    profile
}
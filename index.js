const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/BMS')
const express = require('express');
const bodyParser=require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
const blog = require('./middlewares/isBlog')
app.use(blog.isBlog)

//for admin route
const admin_route = require('./routes/adminRoute');
app.use('/',admin_route)

//for admin route
const user_route = require('./routes/userRoute');
app.use('/',user_route)

//for blog route
const blog_route = require('./routes/blogRoute');
app.use('/',blog_route)


app.listen(3000,()=>console.log('server started'));

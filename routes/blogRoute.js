const express=require('express');
const blog_route=express()
const blogController=require('../controllers/blogController');
blog_route.set('view engine','ejs');
blog_route.set('views','./views');
blog_route.use(express.static('public'));
blog_route.use(express.urlencoded({ extended: true }));
blog_route.use(express.json())
blog_route.get('/',blogController.loadBlog)
blog_route.get('/post/:id',blogController.loadPost)
blog_route.post('/add-comment',blogController.addComment)

module.exports=blog_route

const Post = require('../models/postModel')
const loadBlog = async(req,res)=>{
    try {
        const posts = await Post.find();
        res.render('blog',{posts})
    } catch (error) {
        console.log(error.message);
    }
}
const loadPost = async(req,res)=>{
    try {
      const post_id=req.params.id;
      const post=await Post.findOne({_id:post_id})
      res.render('post',{post:post})
    } catch (error) {
        console.log(error.message);
    }
}

const addComment = async (req, res) => {
  try {
    const { post_id, username, comment } = req.body;

    // Update database with comment
    await Post.findByIdAndUpdate({_id:post_id}, {
      $push: { comments: { username, comment } }
    });

    res.status(200).json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

  
module.exports={
    loadBlog,
    loadPost,
    addComment,
    
}
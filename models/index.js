const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// use index.js to create connections to each model by how they interact in the application

User.hasMany(Post, {
    // connection via db goes here
});
  
Post.belongsTo(User, {
    // connection via db goes here
});
  
Comment.belongsTo(User, {
    // connection via db goes here
});

Comment.belongsTo(Post, {
    // connection via db goes here
});
  
User.hasMany(Comment, {
    // connection via db goes here
});
  
Post.hasMany(Comment, {
    // connection via db goes here
});
  
module.exports = { User, Post, Comment };
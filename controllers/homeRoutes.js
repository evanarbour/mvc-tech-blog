const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


// GET request for all posts -> homepage
router.get('/', async (req, res) => {
    try {
    console.log('GET request received...');
     const PostData = await Post.findAll({
      attributes: [
        'id',
        'title',
        'post_content',
        'date_created'
      ],
      include: [
        {
        // include any comments (and the user data) attached to the posts
          model: Comment,
          attributes: ['id', 'comment_text', 'date_created','user_id', 'post_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
        // include User data attached to the post
          model: User,
          attributes: ['username']
        }
      ]});
        const posts = PostData.map((post) => post.get({ plain: true }));
        // take the data and render it to homepage.handlebars in current session
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn,
          username: req.session.username
        });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
      }
});

// get route for a single post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
              id: req.params.id
            },
            attributes: [
              'id',
              'title',
              'post_content',
              'date_created'
            ],
            include: [
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'date_created','user_id', 'post_id'],
                include: {
                  model: User,
                  attributes: ['username']
                }
              },
              {
                model: User,
                attributes: ['username']
              }
            ]
          })
              // serialize the data
              const post = postData.get({ plain: true })
        
              // render the data to post.handlebars 
              res.render('post', {
                post,
                loggedIn: req.session.loggedIn,
                username: req.session.username
              });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

// login route 
router.get('/login', (req, res) => {
    // if user is logged in, send them to homepage
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    } // or render login.handlebars
    res.render('login');
});
  
  module.exports = router;


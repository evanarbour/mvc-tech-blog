const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all posts for dashboard
router.get('/', withAuth, async (req, res) => {
    try {
       const postData = await Post.findAll({
            where: {
              user_id: req.session.user_id
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
          });
            const posts = postData.map((post) => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true, username: req.session.username });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

// route for edit posts
router.get('/edit/:id', withAuth, (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
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
            const posts = postData.get({ plain: true });
            res.render('edit-post', { posts, loggedIn: true, username: req.session.username });
    
    } catch(err) {
        res.status(500).json(err);
      };
  });
  
  module.exports = router;

const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// ger route for all posts
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

// get route by id
router.get('/:id', withAuth, (req, res) => {
  Post.findOne({
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
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST route to create Post 
router.post('/', withAuth, (req, res) => {
  
  Post.create({
    title: req.body.title,
    post_content: req.body.post_content,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete route 
router.delete('/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
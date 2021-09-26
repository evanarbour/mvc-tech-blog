const router = require('express').Router();
const { response } = require('express');
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// get route for all comments 
router.get('/', withAuth, (req, res) => {
  Comment.findAll()
    .then(commentData => res.status(200).json(commentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  // if the session is active
  if (req.session) {
    // then create the comment
    Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id,
      post_id: req.body.post_id
    })
      .then(commentData => res.status(200).json(commentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

// delete route by id
router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(commentData => {
        // if there is no comment with the id, produce error message
      if (!commentData) {
        res.status(404).json({ message: 'No comment found with this id!' });
        return;
      }
      res.json(commentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
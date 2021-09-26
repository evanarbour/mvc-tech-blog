const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get all users
router.get('/', (req, res) => {
  try {
    const userData = await User.findAll({
        attributes: { exclude: ['password'] }
      })
      const users = userData.map((user) => user.get({ plain: true }));
      res.status(200).json(users);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
    };
});

// post route to create a user 
router.post('/', (req, res) => {
    try {
       const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
        req.session.save(() => {
                req.session.user_id = newUser.id;
                req.session.username = newUser.username;
                req.session.loggedIn = true;
          
                res.status(200).json(dbUserData);
              });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
      };
});

// login route
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { email: req.body.email } });
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        res.json({ user: userData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      res.status(400).json(err);
    }
});

// logout route
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

// delete route
router.delete('/:id', (req, res) => {
    try {
        User.destroy({
            where: {
              id: req.params.id
            }
          })
            .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
              }
              res.json(dbUserData);
            })
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
      };
});
  
module.exports = router;
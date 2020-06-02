const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const auth = require('../middleware');

const router = express.Router();
router.use(express.json());

router.get('/', auth.verifyUser, auth.verifyAdmin, function (req, res, next) {
    User.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.delete('/', auth.verifyUser, auth.verifyAdmin, function (req, res, next) {
    User.findByIdAndRemove(req.body.id)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.post('/signup',  (req, res, next) => {
    User.register(new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName}),
        req.body.password, (err, user) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local') (req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

    const token = auth.getToken({_id: req.user._id});

    res.statusCode = 200;
    res.cookie('token', token);
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token});
});

router.get('/logout', auth.verifyUser, (req, res, next) => {
    res.clearCookie('token');
    res.statusCode = 200;
    res.json({success: true});
});

module.exports = router;
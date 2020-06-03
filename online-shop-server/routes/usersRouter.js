const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const auth = require('../middleware');

const router = express.Router();
router.use(express.json());

router.route('/')
    .get(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        User.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        User.findByIdAndRemove(req.body.id)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

roter.get('/checktoken', auth.verifyUser, (req, res, next) => {
    res.sendStatus(200);
});

roter.get('/checkAdmin', auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    res.sendStatus(200);
});

router.get('/accountinfo', auth.verifyUser, (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
            res.json(user);
        }, (err) => next(err))
        .catch((err) => {
            console.log(err);
            next(err);
        })
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
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local') (req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

    const token = auth.getToken({_id: req.user._id});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
    res.json({success: true, token: token, isAdmin: req.user.isAdmin, inSystem: true});
});

router.get('/logout', auth.verifyUser, (req, res, next) => {
    try {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
        res.json({success: true});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
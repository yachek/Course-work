const express = require('express');
const auth = require('../middleware');
const User = require('../models/User');
const Item = require('../models/Item');

const router = express.Router();
router.use(express.json());

router.route('/')
    .get(auth.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .populate('likedItems')
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(user.likedItems);
            }, (err) => next(err));
    })
    .post(auth.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                if (!user.likedItems.includes(req.body._id)) {
                    user.likedItems.push(req.body._id);
                    user.save()
                        .then((user) => {
                            User.findById(user._id)
                                .populate('likedItems')
                                .then((user) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                                    res.json(user.likedItems);
                                }, (err) => next(err));
                        }, (err) => next(err));
                    Item.findById(req.body._id)
                        .then((item) => {
                            item.likes += 1;
                            item.save();
                        });
                } else {
                    const err = new Error('You have already added it to favourites!');
                    err.status = 406;
                    return next(err);
                }
            }, (err) => next(err));
    })
    .delete(auth.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                const index = user.likedItems.indexOf(req.body._id);
                if (index === -1) {
                    const err = new Error('You haven`t already added it to favourites!');
                    err.status = 406;
                    return next(err);
                } else {
                    user.likedItems.splice(index, 1);
                    user.save()
                        .then((user) => {
                            User.findById(user._id)
                                .populate('likedItems')
                                .then((user) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                                    res.json(user.likedItems);
                                }, (err) => next(err));
                        }, (err) => next(err));
                    Item.findById(req.body._id)
                        .then((item) => {
                            item.likes -= 1;
                            item.save();
                        });
                }
            })
    });

module.exports = router;
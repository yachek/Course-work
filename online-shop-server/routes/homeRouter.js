const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware');
const multer = require('multer');
const config = require('../config');
const fs = require('fs');

const router = express.Router();
router.use(express.json());

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './temp');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

router.route('/')
    .get((req, res, next) => {
        console.log('Get in /home');
        Item.find({})
            .then((items) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                //console.log(items);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(items);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        console.log('post in /home');
        Item.create(req.body)
            .then((items) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(items);
            }, (err) => next(err))
            .catch((err) => {
                console.log(err);
                next(err);
            });
    });

router.route('/:itemId')
    .get((req, res, next) => {
        console.log('Get in /home/:itemId');
        Item.findById(req.params.itemId)
            .then((item) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(item);
            }, (err) => next(err))
            .catch((err) => {
                console.log(err);
                next(err);
            });
    })
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        console.log('Put in /home/:itemId');
        Item.findByIdAndUpdate(req.params.itemId, {
            $set: req.body
        })
            .then((item) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(item);
            }, (err) => (next(err)))
            .catch((err) => {
                console.log(err);
                next(err);
            })
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Item.findByIdAndRemove(req.body._id)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => {
                console.log(err);
                next(err);
            });
    });

router.route('/:itemId/upload')
    .post(auth.verifyUser, auth.verifyAdmin, upload.single('fileData'), (req, res, next) => {
        let fileData = req.file;
        console.log(fileData);
        if (!fileData) {
            res.statusCode = 400;
            res.end('File didn`t save!');
        } else {
            const eager_options = {
                format: 'jpg'
            };
            cloudinary.uploader.upload(fileData.path, {tags: 'online-shop-server', public_id: req.params.itemId,
                eager: eager_options}, (err, image) => {
                if (err) {
                    console.warn(err);
                    res.statusCode = err.http_code;
                    res.json({err: err.message});
                } else {
                    const path = cloudinary.url(image.public_id);
                    console.log(path);
                    Item.findByIdAndUpdate(req.params.itemId, {
                        $set: {photoPath: path}
                    })
                        .then((item) => {
                            fs.unlink(fileData.path, (err) => {
                                console.warn(err)
                            });
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
                            res.json(item);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
            });
        }
    });

module.exports = router;
const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware');
const multer = require('multer');
const config = require('../config');

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
        Item.find({})
            .then((items) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(items);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Item.create(req.body)
            .then((items) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(items);
            }, (err) => next(err))
            .catch((err) => {
                console.log(err);
                res.status(500).send("Error adding new item please try again.");
            });
    });

router.route('/:itemId')
    .get(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        Item.findById(req.params.itemId)
            .then((item) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(item);
            }, (err) => next(err))
            .catch((error) => {
                console.log(error);
                res.status(400).json({err: "Ooops, something went wrong!"});
            });
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
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
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.json(item);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
            });
        }
    });

module.exports = router;
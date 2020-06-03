const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');

const User = require('./models/User');
const Item = require('./models/Item');

const auth = require('./middleware');

const config = require('./config');

const homeRouter = require('./routes/homeRouter');
const usersRouter = require('./routes/usersRouter');
const indexRouter = require('./routes/index');
const likedRouter = require('./routes/likedRouter');

const URL = config.mongoUrl;

mongoose.connect(URL, { useNewUrlParser: true }, function(err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to ${URL}`);
        console.log(process.env.PORT);
    }
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/user', usersRouter);
app.use('/liked', likedRouter);

app.listen(process.env.PORT || 8080);
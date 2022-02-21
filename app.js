require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');

const usersRouter = require('./src/routes/users');
const dishRouter = require('./src/routes/dishRouter');
const promoRouter = require('./src/routes/promoRouter');
const leaderRouter = require('./src/routes/leaderRouter');
const uploadRouter = require('./src/routes/uploadRouter');
const favoriteRouter = require('./src/routes/favoriteRouter');
const commentRouter = require('./src/routes/commentRouter');
const feedbackRouter = require('./src/routes/feedbackRouter');

const app = express();
app.set('env', process.env.ENV);

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 86400000 * 30}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());

app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);
app.use('/feedback', feedbackRouter);

const connect = mongoose.connect(process.env.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

connect.then(
    () => {
        console.log('Connected to db successfully');
    },
    (err) => {
        console.log(err);
    },
);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'DEVELOPMENT' ? err : {};

    res.status(err.status || 500);
    res.send();
});

module.exports = app;

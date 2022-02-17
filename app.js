const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const dishRouter = require('./src/routes/dishRouter');
const promoRouter = require('./src/routes/promoRouter');
const leaderRouter = require('./src/routes/leaderRouter');
const uploadRouter = require('./src/routes/uploadRouter');
const favoriteRouter = require('./src/routes/favoriteRouter');
const commentRouter = require('./src/routes/commentRouter');
const feedbackRouter = require('./src/routes/feedbackRouter');

const url = config.mongoUrl;
const app = express();

app.use(express.static(path.join(__dirname, 'public'),{maxAge:86400000 * 30}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);
app.use('/feedback', feedbackRouter);

//connecting to mongodb
const connect = mongoose.connect(url, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

connect.then(() => {
    console.log('Connected to db successfully');
}, (err) => {
    console.log(err);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send();
});

module.exports = app;
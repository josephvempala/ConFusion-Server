const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./src/models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, process.env.SECRETKEY, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }),
);

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin === true) {
        next();
    } else {
        res.send('Not an Authorized for this action');
        const err = new Error('You are unauthorised to do this action');
        err.status = 401;
        next(err);
    }
};

exports.verifyUser = passport.authenticate('jwt', {session: false});

const Favourites = require('../models/favorites');

const favouritesOptions = (req, res) => {
    res.sendStatus(200);
};

const getFavouritesByUser = async (req, res, next) => {
    try {
        const favouritesByUser = await Favourites.findOne({user: req.user._id}).populate('user').populate('dishes');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favouritesByUser ?? {user: req.user._id, dishes: []});
    } catch (e) {
        next(e);
    }
};

const postFavourite = async (req, res, next) => {
    try {
        const favouritesByUser = await Favourites.findOne({user: req.user._id});
        if (!favouritesByUser) {
            const newFavourites = await Favourites.create({user: req.user._id, dishes: req.body});
            const populatedNewFavourites = await newFavourites.populate('user').populate('dishes');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(populatedNewFavourites);
            return;
        }
        favouritesByUser.dishes.push(...req.body.filter((x) => !favouritesByUser.dishes.contains(x)));
        await favouritesByUser.save();
        const populatedNewFavourites = await favouritesByUser.populate('user').populate('dishes');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(populatedNewFavourites);
    } catch (e) {
        next(e);
    }
};

const deleteFavourites = async (req, res, next) => {
    try {
        const result = await Favourites.findOneAndDelete({user: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
};

const getFavouritesByParam = async (req, res, next) => {
    try {
        const favourites = await Favourites.findOne({user: req.user._id});
        if (!favourites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({exists: false, favorites: favourites});
            return;
        }
        if (favourites.dishes.indexOf(req.params.id !== -1)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({exists: true, favorites: favourites});
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({exists: false, favorites: favourites});
    } catch (e) {
        next(e);
    }
};

const postFavouritesByParam = async (req, res, next) => {
    try {
        const favourite = await Favourites.findOne({user: req.user._id});
        if (!favourite) {
            const newFavourites = await Favourites.create({user: req.user._id, dishes: [req.params.id]});
            const populatedFavourites = await newFavourites.populate('user').populate('dishes');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(populatedFavourites);
            return;
        }
        if (favourite.dishes.indexOf(req.params.id) !== -1) {
            favourite.dishes.splice(favourite.dishes.indexOf(req.params.id), 1);
            await favourite.save();
            await favourite.populate('user').populate('dishes');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favourite);
            return;
        }
        favourite.dishes.push(req.params.id);
        await favourite.save();
        const populatedFavourites = await Favourites.findById(favourite._id).populate('user').populate('dishes');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(populatedFavourites);
    } catch (e) {
        next(e);
    }
};

const deleteFavouritesByParam = async (req, res, next) => {
    const favourite = await Favourites.findOne({user: req.user._id});
    if (!favourite) {
        const err = new Error('no favorites');
        err.status = 404;
        next(err);
        return;
    }
    if (!favourite.dishes.indexOf(req.params.id > -1)) {
        const err = new Error('no favorite not found');
        err.status = 404;
        next(err);
        return;
    }
    favourite.dishes.splice(favourite.dishes.indexOf(req.params.id), 1);
    await favourite.save();
    const populatedFavourite = await favourite.populate('user').populate('dishes');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(populatedFavourite);
};

module.exports = {
    deleteFavourites,
    deleteFavouritesByParam,
    favouritesOptions,
    postFavouritesByParam,
    getFavouritesByParam,
    getFavouritesByUser,
    postFavourite,
};

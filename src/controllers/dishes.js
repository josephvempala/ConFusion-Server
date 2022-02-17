const Dishes = require('../models/dishes');

const dishesOptions = (req, res) => {
    res.sendStatus(200);
}

const getDishes = async (req, res, next) => {
    try {
        const dishes = await Dishes.find(req.query).populate('comments.author');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    } catch (e) {
        next(e);
    }
}

const postDish = async (req, res, next) => {
    try {
        const newDish = await Dishes.create(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(newDish);
    } catch (e) {
        next(e);
    }
}

const deleteDish = async (req, res, next) => {
    try {
        const result = await Dishes.remove({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
}

const getDishById = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.id).populate('comments.author');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    } catch (e) {
        next(e);
    }
}

const patchDishById = async (req, res, next) => {
    try {
        const result = await Dishes.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
}

const deleteDishById = async (req, res, next) => {
    try {
        const result = await Dishes.findByIdAndRemove(req.params.id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    dishesOptions,
    deleteDish,
    deleteDishById,
    getDishById,
    getDishes,
    patchDishById,
    postDish
}
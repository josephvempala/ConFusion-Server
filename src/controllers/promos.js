const Promos = require('../models/promotions');

const promoOptions = (req, res) => {
    res.sendStatus(200);
};

const getPromos = async (req, res, next) => {
    try {
        const promos = await Promos.find(req.query).lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    } catch (e) {
        next(e);
    }
};

const postPromo = async (req, res, next) => {
    try {
        const newPromo = await Promos.create(req.body).lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(newPromo);
    } catch (e) {
        next(e);
    }
};

const deletePromos = async (req, res) => {
    const result = await Promos.deleteMany({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
};

const getPromoByParam = async (req, res, next) => {
    try {
        const promo = await Promos.findById(req.params.id).lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    } catch (e) {
        next(e);
    }
};

const patchPromoByParam = async (req, res, next) => {
    try {
        const updatedPromo = await Promos.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updatedPromo);
    } catch (e) {
        next(e);
    }
};

const deletePromoByParam = async (req, res, next) => {
    try {
        const result = await Promos.findByIdAndDelete(req.params.id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    deletePromoByParam,
    deletePromos,
    getPromoByParam,
    getPromos,
    promoOptions,
    patchPromoByParam,
    postPromo,
};

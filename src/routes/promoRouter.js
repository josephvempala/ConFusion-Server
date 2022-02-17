const express = require('express');
const authenticate = require('../../authenticate')
const cors = require('../../cors');
const {
    promoOptions,
    getPromos,
    postPromo,
    deletePromos,
    getPromoByParam,
    patchPromoByParam,
    deletePromoByParam
} = require("../controllers/promos");

const promoRouter = express.Router();

promoRouter.route('/')
    .options(cors.corsWithOptions, promoOptions)
    .get(cors.cors, getPromos)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, postPromo)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deletePromos);

promoRouter.route('/:id')
    .options(cors.corsWithOptions, promoOptions)
    .get(cors.cors, getPromoByParam)
    .patch(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, patchPromoByParam)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deletePromoByParam);

module.exports = promoRouter;
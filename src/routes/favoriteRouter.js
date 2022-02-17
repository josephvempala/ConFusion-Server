const express = require('express');
const authenticate = require('../../authenticate');
const cors = require('../../cors');
const {
    favouritesOptions, getFavouritesByUser, postFavourite, deleteFavourites, getFavouritesByParam,
    postFavouritesByParam, deleteFavouritesByParam
} = require("../controllers/favourites");

const favoriteRouter = express.Router()

favoriteRouter.route('/')
    .options(cors.corsWithOptions, favouritesOptions)
    .get(cors.corsWithOptions, authenticate.verifyUser, getFavouritesByUser)
    .post(cors.corsWithOptions, authenticate.verifyUser, postFavourite)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteFavourites)

favoriteRouter.route('/:id')
    .options(cors.corsWithOptions, favouritesOptions)
    .get(cors.corsWithOptions, authenticate.verifyUser, getFavouritesByParam)
    .post(cors.corsWithOptions, authenticate.verifyUser, postFavouritesByParam)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteFavouritesByParam)

module.exports = favoriteRouter;
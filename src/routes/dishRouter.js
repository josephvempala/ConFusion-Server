const express = require('express');
const authenticate = require('../../authenticate');
const cors = require('../../cors');
const {dishesOptions, deleteDishById, getDishById, deleteDish, patchDishById, postDish, getDishes} = require('../controllers/dishes');

const dishRouter = express.Router();

dishRouter
    .route('/')
    .options(cors.corsWithOptions, dishesOptions)
    .get(cors.cors, getDishes)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, postDish)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteDish);

dishRouter
    .route('/:id')
    .options(cors.corsWithOptions, dishesOptions)
    .get(cors.cors, getDishById)
    .patch(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, patchDishById)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteDishById);

module.exports = dishRouter;

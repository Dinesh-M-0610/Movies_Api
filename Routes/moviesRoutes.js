const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

router.route('/')
    //Route = http method + url
    .get(moviesController.getAllMovies)
    //POST method
    .post(moviesController.createMovie)

router.route('/:id')
    //Get method with id
    .get(moviesController.getMovie)
    //Modifying the json values using patch
    .patch(moviesController.updateMovie)
    //delete request methods
    .delete(moviesController.deleteMovie)

module.exports = router;
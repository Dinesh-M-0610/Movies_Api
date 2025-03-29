const CustomError = require('../Utils/CustomError');
const Movie = require('./../Models/movieModel')
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

exports.getHighestRated = (req,res,next) => {
    req.query.limit = "5";
    req.query.sort = '-ratings'

    next();
}

//ROUTE handler functions
exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    let queryStr = JSON.stringify(req.query);
    const queryObj = JSON.parse(queryStr);

    // Remove sort from queryObj so it doesn't interfere with filtering
    const sortParam = queryObj.sort;
    delete queryObj.sort;

    let query = Movie.find(queryObj);

    // Apply sorting if sort parameter exists
    if (sortParam) {
        query = query.sort(sortParam.split(',').join(' ')); // Support multiple sorting criteria
    }

    const movies = await query;

    res.status(200).json({
        status: 'success',
        results: movies.length,
        data: movies,
    });
});

exports.getMovie = asyncErrorHandler(async (req,res,next) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        const error = new CustomError("Movie id is not found",404);
        return next(error);
    }
    res.status(200).json({ status: 'success', data: movie });
    
});

exports.createMovie = asyncErrorHandler(async (req,res,next) => {
    const movie = await Movie.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            movie
        }
    })
});

exports.updateMovie = asyncErrorHandler(async (req, res,next) => {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMovie) {
        const error = new CustomError("Movie id is not found",404);
        return next(error);
    }
    res.status(200).json({ status: 'success', data: updatedMovie });
    
});

exports.deleteMovie = asyncErrorHandler(async (req, res,next) => {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
        const error = new CustomError("Movie id is not found",404);
        return next(error);
    }
    res.status(204).json({ status: 'success', data: null });
});

exports.getMovieStats = asyncErrorHandler(async (req,res,next) => {
    const stats = await Movie.aggregate([
        {$match : {ratings: {$gte: 4.5}}},
        {$group: {
            _id: '$releaseYear',
            avgRating: { $avg: '$ratings'},
            avgPrice: { $avg: '$price'},
            minPrice: { $min: '$price'},
            maxPrice: { $max: '$price'},
            priceTotal: { $sum: '$price'},
            movieCount: { $sum: 1}
        }},
        { $sort: { minPrice: 1}},
        // { $match: {maxPrice: {$gte: 60}}}
    ]);

    res.status(204).json({ 
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    });
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
    const genre = req.params.genre;

    let matchStage = {};
    if (genre) {
        matchStage = { genres: genre };
    }

    const movies = await Movie.aggregate([
        { $unwind: '$genres' },
        { $match: matchStage },
        {
            $group: {
                _id: '$genres',
                movieCount: { $sum: 1 },
                movies: { $push: '$name' },
            }
        },
        { $addFields: { genre: "$_id" } },
        { $project: { _id: 0 } }
    ]);

    if (movies.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'No movies found' });
    }

    res.status(200).json({
        status: 'success',
        results: movies.length,
        data: movies
    });
});

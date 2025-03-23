const Movie = require('./../Models/movieModel')

exports.getHighestRated = (req,res,next) => {
    req.query.limit = "5";
    req.query.sort = '-ratings'

    next();
}

//ROUTE handler functions
exports.getAllMovies = async (req, res) => {
    try {
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

    } catch (err) {
        console.error("Error Fetching Movies:", err.message);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

exports.getMovie = async (req,res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ status: 'fail', message: 'Movie not found' });
        }
        res.status(200).json({ status: 'success', data: movie });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.createMovie = async (req,res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                movie
            }
        })
    }catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedMovie) {
            return res.status(404).json({ status: 'fail', message: 'Movie not found' });
        }
        res.status(200).json({ status: 'success', data: updatedMovie });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ status: 'fail', message: 'Movie not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.getMovieStats = async (req,res) => {
    try{
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
    }catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getMovieByGenre = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

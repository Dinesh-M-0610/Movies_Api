const Movie = require('./../Models/movieModel')

//ROUTE handler functions
exports.getAllMovies = async (req,res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({ status: 'success', results: movies.length, data: movies });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

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
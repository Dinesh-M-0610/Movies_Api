const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field"],
        unique: true,
        trim: true
    },
    description: String,
    duration: {
        type: Number,
        required: [true, "Duration is required field"],
        trim: true
    },
    ratings: {
        type: Number
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required field"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        dafault: Date.now()
    },
    genres: {
        type: [String],
        required: [true, "Genres is required field"]
    },
    directors: {
        type: [String],
        required: [true, "directors is required field"]
    },
    coverImage: {
        type: [String],
        required: [true, "cover image is required field"]
    },
    actors: {
        type: [String],
        require: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        require: [true, "price is required field"]
    }
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
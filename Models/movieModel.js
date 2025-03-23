const mongoose = require('mongoose')
const fs = require('fs')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field"],
        unique: true,
        maxlength: [100, "Movie name must not have more than 100 characters"],
        minlength: [4, "Movie name must have minimum 4 characters"],
        trim: true
    },
    description: String,
    duration: {
        type: Number,
        required: [true, "Duration is required field"],
        trim: true
    },
    ratings: {
        type: Number,
        validate: {
            validator: function(value){
                return value >= 1 && value <= 10;
            }
        }
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
    },
    createdBy: String
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60;
})

movieSchema.pre("save",function(next){
    this.createdBy = "Dinesh"
    next();
})

movieSchema.post('save', function(doc,next){
    const content = `a new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`
    fs.writeFileSync('./Log/log.txt',ContentVisibilityAutoStateChangeEvent, {flag: 'a'}, (err) => {
        console.log(err.message);
    });
    next();
})

movieSchema.pre('/*find/', function(next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.startTime = Date.now()
    next();
})

movieSchema.post('/*find/', function(docs, next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.endTime = Date.now();

    const content = `Query took ${this.endTime - this.startTime} milliseconds`
    fs.writeFileSync('./Log/log.txt',ContentVisibilityAutoStateChangeEvent, {flag: 'a'}, (err) => {
        console.log(err.message);
    });

    next();
})

movieSchema.pre('aggregate', function(next){
    console.log(this.pipeline().unshift({$match: {releaseDate: {lte: new Date()}}}))
    next();
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 
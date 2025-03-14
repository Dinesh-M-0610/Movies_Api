const fs = require('fs');

let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

exports.checkId = (req, res, next, value) => {
    console.log('Movie ID is ' + value);
    let mov = movies.find((movie) => movie.id === parseInt(value));

    if (!mov) {
        return res.status(404).json({
            status: "fail",
            message: "Movie not found with the id"
        });
    }

    next();
};

exports.validateBody = (req,res,next) => {
    if(!req.body.name || ! req.body.releaseYear){
        return res.status(400).json({
            status: 'fail',
            message: 'Not a valid movie data'
        });
    }
    next();
}

//ROUTE handler functions
exports.getAllMovies = (req,res) => {
    res.status(200).json({
        status: "success",
        requestedAt : req.requestedAt,
        count: movies.length,
        data: {
            movies: movies
        }
    });
}


exports.getMovie = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    let mov = movies.find((movie) => {
        return movie.id  === id
    })

    // if(!mov){
    //     res.status(404).json({
    //         status: "fail",
    //         message: "Movie not found with the id"
    //     })
    // }
    res.status(200).json({
        status: "success",
        data: {
            movie: mov
        }
    });
}

exports.createMovie = (req,res) => {
    //console.log(req.body);
    const newId = movies[movies.length-1].id+1;

    const newMovie = Object.assign({id: newId}, req.body);

    movies.push(newMovie);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movie: newMovie
            }
        })
    })
    //res.send('Created');
}

exports.updateMovie = (req, res) => {
    let id = req.params.id * 1
    let movieToUpdate = movies.find(el => el.id === id);

    // if(!movieToUpdate){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: "No movie object present"
    //     })
    // }

    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);

    movies[index] = movieToUpdate;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate
            }
        })
    })
}

exports.deleteMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el => el.id === id);

    // if(!movieToDelete){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: "No movie object present"
    //     })
    // }

    const index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movie: null
            }
        })
    })
}
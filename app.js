//Import package
const express = require('express');
const fs = require("fs");

let app = express();
let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

const logger = function(req, res, next){
    console.log("custom middleware called");
    next();
}

app.use(express.json());
app.use(logger);
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next()
})


//ROUTE handler functions
const getAllMovies = (req,res) => {
    res.status(200).json({
        status: "success",
        requestedAt : req.requestedAt,
        count: movies.length,
        data: {
            movies: movies
        }
    });
}


const getMovie = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    let mov = movies.find((movie) => {
        return movie.id  === id
    })

    if(!mov){
        res.status(404).json({
            status: "fail",
            message: "Movie not found with the id"
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            movie: mov
        }
    });
}

const creatMovie = (req,res) => {
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

const updateMovie = (req, res) => {
    let id = req.params.id * 1
    let movieToUpdate = movies.find(el => el.id === id);

    if(!movieToUpdate){
        res.status(404).json({
            status: 'fail',
            message: "No movie object present"
        })
    }

    let index = movies.index(movieToUpdate);
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

const deleteMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el => el.id === id);

    if(!movieToDelete){
        res.status(404).json({
            status: 'fail',
            message: "No movie object present"
        })
    }

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

app.route('/api/v1/movies')
    //Route = http method + url
    .get(getAllMovies)
    //POST method
    .post(creatMovie)

app.route('/api/v1/movies/:id')
    //Get method with id
    .get(getMovie)
    //Modifying the json values using patch
    .patch(updateMovie)
    //delete request methods
    .delete(deleteMovie)

//Create a server
const port = 3000;
app.listen(port, () =>{
    console.log("server has started...");
})